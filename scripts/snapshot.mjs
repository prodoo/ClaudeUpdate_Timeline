/* snapshot.mjs — 타임라인 데이터의 실제 상태를 결정론적으로 산출한다.
 *
 * 하는 일:
 *   1. data/*.js + data/codex/*.js 를 vm 샌드박스(window 셰임)에서 평가해 레인별 항목을 읽는다.
 *   2. 레인별 count·cutoffDate(maxDate)·latestVersion 과 파일 경로를 모은다.
 *   3. index.html / codex.html 의 LAST_CHECKED·footer 기준일을 읽어 데이터 maxDate 와 비교(드리프트 표).
 *   4. scripts/state.json 을 쓴다 — Workflow 조사 에이전트의 cutoff/중복 베이스라인 + ingest 의 경로 매핑.
 *
 * 읽기 전용. 실행: node scripts/snapshot.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 한 데이터 파일을 평가해 [{lane, entries, path}] 반환 (파일당 레인 1개 기대).
function loadLanes(path) {
  const text = readFileSync(path, 'utf8');
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(text, ctx, { filename: path });
  const ebs = ctx.window.EVENTS_BY_SOURCE || {};
  return Object.keys(ebs).map((lane) => ({ lane, entries: ebs[lane] || [], path }));
}

function listDataFiles(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => join(dir, f));
}

function maxBy(arr, pick) {
  return arr.reduce((m, x) => (pick(x) > pick(m) ? x : m), arr[0]);
}

// 한 side(claude|codex)의 레인 파일 목록을 받아 레인별 요약 + side maxDate 계산.
function summarizeSide(files) {
  const lanes = {};
  for (const path of files) {
    for (const { lane, entries } of loadLanes(path)) {
      const sorted = [...entries].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
      const latest = sorted[sorted.length - 1] || {};
      lanes[lane] = {
        path: relative(ROOT, path).replace(/\\/g, '/'),
        count: entries.length,
        cutoffDate: latest.date || '',
        latestVersion: latest.version || '',
        // 중복 베이스라인 + 에이전트 컨텍스트용 최근 8건
        recent: sorted.slice(-8).map((e) => ({ date: e.date, title: e.title, version: e.version || '' })),
      };
    }
  }
  const allDates = Object.values(lanes).map((l) => l.cutoffDate).filter(Boolean);
  const maxDate = allDates.length ? allDates.reduce((m, d) => (d > m ? d : m)) : '';
  return { lanes, maxDate };
}

function readMarker(htmlPath, re) {
  const m = readFileSync(htmlPath, 'utf8').match(re);
  return m ? m[1] : null;
}

const claude = summarizeSide(listDataFiles(join(ROOT, 'data')));
const codex = summarizeSide(listDataFiles(join(ROOT, 'data', 'codex')));

const LC = /LAST_CHECKED:\s*(\d{4}-\d{2}-\d{2})/;
const FOOT = /(\d{4}-\d{2}-\d{2})\s*기준/;
const drift = {
  claude: {
    dataMaxDate: claude.maxDate,
    lastChecked: readMarker(join(ROOT, 'index.html'), LC),
    footerDate: readMarker(join(ROOT, 'index.html'), FOOT),
  },
  codex: {
    dataMaxDate: codex.maxDate,
    lastChecked: readMarker(join(ROOT, 'codex.html'), LC),
    footerDate: readMarker(join(ROOT, 'codex.html'), FOOT),
  },
};

const today = new Date().toISOString().slice(0, 10);
const state = { today, claude: claude.lanes, codex: codex.lanes, drift };
writeFileSync(join(__dirname, 'state.json'), JSON.stringify(state, null, 2) + '\n', 'utf8');

// ── 출력 ──────────────────────────────────────────────────────────────
function printLaneTable(title, lanes) {
  console.log(`\n## ${title}`);
  const rows = Object.entries(lanes).map(([lane, l]) => ({
    lane, count: l.count, cutoff: l.cutoffDate, version: l.latestVersion, file: l.path,
  }));
  const w = (k) => Math.max(k.length, ...rows.map((r) => String(r[k]).length));
  const cols = ['lane', 'count', 'cutoff', 'version', 'file'];
  const widths = Object.fromEntries(cols.map((c) => [c, w(c)]));
  const line = (vals) => cols.map((c) => String(vals[c]).padEnd(widths[c])).join('  ');
  console.log(line(Object.fromEntries(cols.map((c) => [c, c]))));
  console.log(cols.map((c) => '-'.repeat(widths[c])).join('  '));
  for (const r of rows) console.log(line(r));
}

console.log(`# snapshot @ ${today}`);
printLaneTable('Claude (index.html / data/*.js)', claude.lanes);
printLaneTable('Codex (codex.html / data/codex/*.js)', codex.lanes);

console.log('\n## 드리프트 (마커 vs 실제 데이터)');
for (const side of ['claude', 'codex']) {
  const d = drift[side];
  const warns = [];
  // 데이터가 LAST_CHECKED 이후면 마커가 오래된 것(재확인·갱신 필요).
  if (d.dataMaxDate && d.lastChecked && d.dataMaxDate > d.lastChecked) warns.push('데이터가 LAST_CHECKED 이후 — 마커 갱신 필요');
  // footer 기준일과 LAST_CHECKED가 다르면 스탬프 불일치.
  if (d.footerDate && d.lastChecked && d.footerDate !== d.lastChecked) warns.push('footer≠LAST_CHECKED');
  console.log(
    `${side.padEnd(7)} 데이터=${d.dataMaxDate}  LAST_CHECKED=${d.lastChecked}  footer=${d.footerDate}` +
      (warns.length ? `  ⚠️ ${warns.join(' / ')}` : '  ✓ 정합'),
  );
}
console.log(`\nstate.json 작성 완료 → ${relative(ROOT, join(__dirname, 'state.json')).replace(/\\/g, '/')}`);
