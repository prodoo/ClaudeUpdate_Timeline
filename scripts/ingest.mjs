/* ingest.mjs — 검토를 마친 candidates.json 을 레인 데이터 파일에 결정론적으로 반영한다.
 *
 * 두 가지 모드:
 *   1) 기본:   node scripts/ingest.mjs [--candidates scripts/candidates.json]
 *        candidates 의 신규 항목을 중복 제거 후 해당 레인 파일에 날짜순으로 삽입한다.
 *        일반 케이스(신규가 기존 max 이후)는 텍스트 append 로 기존 바이트를 보존(수술적 변경).
 *        out-of-order 백필이 있으면 그 레인만 전체 재직렬화하고 경고한다.
 *        헤더의 'N events' 카운트와 'Verified:' 날짜만 함께 갱신한다.
 *   2) 스탬프: node scripts/ingest.mjs --stamp <YYYY-MM-DD> <claudeVer> <codexVer>
 *        index.html / codex.html 의 footer 기준일 + LAST_CHECKED 만 동기한다.
 *
 * 멱등: 추가할 신규가 없는 레인 파일은 건드리지 않는다(재실행 시 추가 0건).
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const KEYS = ['date', 'title', 'version', 'importance', 'stage', 'summary', 'url'];

// ── 공통 ──────────────────────────────────────────────────────────────
function loadLanes(path) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(readFileSync(path, 'utf8'), ctx, { filename: path });
  const ebs = ctx.window.EVENTS_BY_SOURCE || {};
  return Object.keys(ebs).map((lane) => ({ lane, entries: ebs[lane] || [], path }));
}

function scanSide(dir) {
  const map = {}; // lane -> { path, entries }
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.js'))) {
    for (const { lane, entries, path } of loadLanes(join(dir, f))) map[lane] = { path, entries };
  }
  return map;
}

function entryKey(e) {
  return `${e.date}|${e.version || ''}|${e.title}`;
}

function serializeEntry(e) {
  return (
    '{' +
    KEYS.map((k) => (k === 'importance' ? `importance:${Number(e[k])}` : `${k}:${JSON.stringify(e[k] ?? '')}`)).join(',') +
    '}'
  );
}

function validateEntry(e, where) {
  const extra = Object.keys(e).filter((k) => !KEYS.includes(k));
  if (extra.length) throw new Error(`${where}: 허용되지 않은 필드 ${JSON.stringify(extra)} — 데이터 손실 방지 위해 중단`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date)) throw new Error(`${where}: date 형식 오류 "${e.date}"`);
  if (typeof e.title !== 'string' || !e.title) throw new Error(`${where}: title 누락`);
  if (typeof e.version !== 'string') throw new Error(`${where}: version 은 문자열이어야 함(빈 문자열 허용)`);
  if (!Number.isInteger(e.importance) || e.importance < 1 || e.importance > 5)
    throw new Error(`${where}: importance 는 1~5 정수 ("${e.importance}")`);
  if (typeof e.stage !== 'string' || !e.stage) throw new Error(`${where}: stage 누락`);
  if (typeof e.summary !== 'string' || !e.summary) throw new Error(`${where}: summary 누락`);
  if (!/^https?:\/\//.test(e.url || '')) throw new Error(`${where}: url 은 http(s) 여야 함 ("${e.url}")`);
}

function updateHeader(text, count, today) {
  return text
    .replace(/(\d+)\s+events/, `${count} events`) // 'N events' 있을 때만
    .replace(/Verified:\s*\d{4}-\d{2}-\d{2}/, `Verified: ${today}`);
}

// 한 레인 파일에 신규 항목 삽입. 반환: 추가 건수.
function patchLane(path, existing, fresh, today) {
  if (fresh.length === 0) return 0;
  const existingMax = existing.reduce((m, e) => (e.date > m ? e.date : m), '');
  const sortedFresh = [...fresh].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const inOrder = !sortedFresh.some((e) => e.date < existingMax); // 신규가 모두 기존 max 이후인가
  const count = existing.length + fresh.length;
  let text = readFileSync(path, 'utf8');

  if (inOrder) {
    // 텍스트 append: 기존 바이트 보존, 마지막 항목 뒤에 콤마+신규.
    const pos = text.lastIndexOf('\n];');
    if (pos < 0) throw new Error(`${path}: 닫는 '];' 를 찾지 못함`);
    // 기존 마지막 항목에 trailing comma가 있을 수 있으므로 제거 후 정확히 하나만 추가.
    const head = text.slice(0, pos).replace(/,\s*$/, '');
    const tail = text.slice(pos); // '\n];\n'
    const lead = existing.length ? ',\n' : '\n';
    text = head + lead + sortedFresh.map(serializeEntry).join(',\n') + tail;
  } else {
    // 백필 존재: 그 레인만 전체 재정렬·재직렬화.
    for (const e of existing) validateEntry(e, `${relative(ROOT, path)} 기존항목`);
    const merged = [...existing, ...sortedFresh].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    const openRe = /\(window\.EVENTS_BY_SOURCE[^\n]*=\s*\[/;
    const m = text.match(openRe);
    if (!m) throw new Error(`${path}: EVENTS_BY_SOURCE 여는 줄을 찾지 못함`);
    const prefix = text.slice(0, m.index + m[0].length);
    text = prefix + '\n' + merged.map(serializeEntry).join(',\n') + '\n];\n';
    console.warn(`  ⚠️ ${relative(ROOT, path)}: out-of-order 신규 → 전체 재직렬화(기존 항목 형식 정규화됨)`);
  }

  // 데이터 파일 블롭은 LF이므로 LF로 정규화한다(append한 줄과 기존 CRLF가 섞여 diff가 오염되는 것 방지).
  writeFileSync(path, updateHeader(text, count, today).replace(/\r\n?/g, '\n'), 'utf8');
  return fresh.length;
}

// ── 스탬프 모드 ───────────────────────────────────────────────────────
function stampMode(date, claudeVer, codexVer) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--stamp 날짜 형식 오류 "${date}"`);
  const apply = (file, ver) => {
    const p = join(ROOT, file);
    let t = readFileSync(p, 'utf8');
    const before = t;
    t = t.replace(/(\d{4}-\d{2}-\d{2})\s*기준/, `${date} 기준`);
    // 타임라인 스크립트의 TODAY 상수 동기 — D_MAX·today 마커·자동 스크롤이 여기서 파생됨.
    t = t.replace(/const TODAY = "\d{4}-\d{2}-\d{2}"/, `const TODAY = "${date}"`);
    // 주석 전체를 매칭해 재작성한다(`-->` 보존). 종전 날짜 전용 매칭은 닫는 토큰을 삼켰음.
    t = t.replace(/<!--\s*LAST_CHECKED:[^>]*-->/, `<!-- LAST_CHECKED: ${date} ${ver} -->`);
    if (t === before) console.warn(`  · ${file}: 변경 없음 (이미 동기됨 또는 패턴 없음)`);
    writeFileSync(p, t, 'utf8');
    console.log(`  ${file}: footer 기준일 + LAST_CHECKED → ${date} ${ver}`);
  };
  console.log('# stamp');
  apply('index.html', claudeVer);
  apply('codex.html', codexVer);
}

// ── 진입점 ────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
if (argv[0] === '--stamp') {
  const [, date, claudeVer = '', codexVer = ''] = argv;
  stampMode(date, claudeVer, codexVer);
  process.exit(0);
}

const candPath = argv.includes('--candidates') ? argv[argv.indexOf('--candidates') + 1] : join(__dirname, 'candidates.json');
const candidates = JSON.parse(readFileSync(candPath, 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const sides = { claude: scanSide(join(ROOT, 'data')), codex: scanSide(join(ROOT, 'data', 'codex')) };

console.log(`# ingest @ ${today}  (candidates: ${relative(ROOT, candPath).replace(/\\/g, '/')})`);
let totalAdded = 0;
for (const side of ['claude', 'codex']) {
  const byLane = candidates[side] || {};
  for (const [lane, entries] of Object.entries(byLane)) {
    const slot = sides[side][lane];
    if (!slot) throw new Error(`알 수 없는 레인 "${lane}" (side=${side}) — state.json 의 레인명과 일치해야 함`);
    entries.forEach((e, i) => validateEntry(e, `${side}/${lane}[${i}]`));
    const have = new Set(slot.entries.map(entryKey));
    const seen = new Set();
    const fresh = entries.filter((e) => {
      const k = entryKey(e);
      if (have.has(k) || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const added = patchLane(slot.path, slot.entries, fresh, today);
    totalAdded += added;
    console.log(`  ${side}/${lane.padEnd(16)} +${added}${added !== entries.length ? `  (입력 ${entries.length}, 중복 ${entries.length - added})` : ''}`);
  }
}
console.log(`\n총 추가: ${totalAdded}건. 다음: snapshot 재실행으로 cutoff 확인 → 브라우저 검증.`);
