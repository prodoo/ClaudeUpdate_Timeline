/* manual-lint.mjs — 매뉴얼 18편 + 허브 2편의 내부 무결성을 결정론적으로 검사한다.
 *
 * snapshot.mjs 가 "타임라인 데이터"의 드리프트를 본다면, 이 스크립트는 "매뉴얼 측"을 본다.
 * 드로어 바인딩 계약(패널 셀 textContent === COMMAND_DETAILS 키, 정확 일치)을 그대로 미러링한다.
 *
 * 검사 항목 (severity):
 *   [FAIL] COMMAND_DETAILS JS 파싱 오류           — 드로어 시스템 전체가 죽음
 *   [FAIL] 파일 내 스탬프 불일치                   — LAST_CHECKED 날짜/버전 ≠ footer 날짜/버전
 *   [WARN] 죽은 행(dead row)                       — 명령어형 패널 토큰인데 매칭 키 없음 → 클릭해도 안 열림
 *   [WARN] 고아 엔트리(orphan)                     — COMMAND_DETAILS 키인데 그 텍스트의 패널 셀이 없음
 *   [WARN] 매뉴얼 버전 지연(lag)                   — 매뉴얼 버전 ≠ 메인 타임라인(index/codex.html) 버전
 *   [WARN] 패널 .cnt 불일치                        — 선언 개수 ≠ 실제 행 수 (숫자형 cnt만)
 *   [WARN] 허브 검색 누락                          — 링크된 페이지 명령어 키가 허브 data-commands에 없음
 *
 * 읽기 전용. 실행: node scripts/manual-lint.mjs   (FAIL 있으면 exit 1)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const MANUAL = join(ROOT, 'update todo');

let failCount = 0;
let warnCount = 0;
const log = (s) => console.log(s);
const fail = (file, msg) => { failCount++; log(`  [FAIL] ${file}: ${msg}`); };
const warn = (file, msg) => { warnCount++; log(`  [WARN] ${file}: ${msg}`); };

// ---------- 추출 헬퍼 ----------

// COMMAND_DETAILS = { ... } 블록을 추출해 평가한다. 없으면 null, 파싱 실패면 throw.
function parseDrawer(html) {
  const m = html.match(/COMMAND_DETAILS\s*=\s*(\{[\s\S]*?\n\s*\})\s*;/);
  if (!m) return null;
  return (0, eval)('(' + m[1] + ')'); // 구문 오류 시 throw → 호출부에서 FAIL 처리
}

// 드로어 바인딩이 트리거를 거는 셀의 키 텍스트를 그대로 뽑는다(정확 일치 규칙 미러링).
// 브라우저는 textContent(=엔티티 디코딩된 값)로 매칭하므로, 추출 시에도 디코딩한다.
//   .cmd / .row / .lrow → 첫 <code>의 textContent
//   .cmd-badge(플레이북) → 배지 textContent
function panelTokens(html) {
  const toks = [];
  for (const m of html.matchAll(/<(?:div|li)\s+class="(?:cmd|row|lrow)[^"]*">\s*<code>([\s\S]*?)<\/code>/g)) {
    toks.push(htmlText(m[1]));
  }
  for (const m of html.matchAll(/<span\s+class="cmd-badge[^"]*">([\s\S]*?)<\/span>/g)) {
    toks.push(htmlText(m[1]));
  }
  return toks;
}

const stripTags = (s) => s.replace(/<[^>]+>/g, '');
const decodeEntities = (s) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const htmlText = (s) => decodeEntities(stripTags(s)).replace(/\s+/g, ' ').trim();

// 명령어형 토큰만 죽은행 검사 대상(키보드·기호·개념 라벨 제외).
const isCommandLike = (t) => /^(\/[a-zA-Z]|claude\b|codex\b|--?[a-zA-Z]|@$)/.test(t);

// 날짜를 YYYY-MM-DD로 정규화. "2026년 5월 31일" · "2026-05-31" · "2026.05.31" 모두 처리.
function normDate(s) {
  const m = s.match(/(\d{4})[년.\-]\s*(\d{1,2})[월.\-]\s*(\d{1,2})/);
  if (!m) return null;
  return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
}
const verOf = (s) => { const m = s.match(/v\d+\.\d+\.\d+/); return m ? m[0] : null; };

// LAST_CHECKED 주석에서 날짜·버전 추출.
function lastChecked(html) {
  const m = html.match(/LAST_CHECKED:\s*(\d{4}-\d{2}-\d{2})\s+([^>]*?)\s*-->/);
  return m ? { date: m[1], ver: verOf(m[2]) } : null;
}
// <footer>…</footer> 안의 기준 날짜·버전 추출.
function footerStamp(html) {
  const fm = html.match(/<footer[\s\S]*?<\/footer>/i);
  if (!fm) return null;
  const f = fm[0];
  const ds = f.match(/[^>]*기준/);
  return { date: ds ? normDate(ds[0]) : null, ver: verOf(f) };
}

// ---------- 파일 분류 ----------
function manualHtml(side) {
  const dir = join(MANUAL, side);
  return readdirSync(dir).filter((f) => f.endsWith('.html')).map((f) => join(dir, f));
}
const rel = (p) => relative(ROOT, p).replace(/\\/g, '/');

// 메인 타임라인 = 현 사이클 기준점(버전 지연 비교용).
const canonical = {
  ClaudeCode: lastChecked(readFileSync(join(ROOT, 'index.html'), 'utf8')),
  Codex: lastChecked(readFileSync(join(ROOT, 'codex.html'), 'utf8')),
};

// ---------- 파일별 검사 ----------
function lintFile(path, side) {
  const file = rel(path);
  const html = readFileSync(path, 'utf8');

  // 1) 스탬프 정합 (파일 내 LAST_CHECKED ↔ footer)
  const lc = lastChecked(html);
  const ft = footerStamp(html);
  if (lc && ft) {
    if (ft.date && lc.date !== ft.date) fail(file, `LAST_CHECKED 날짜(${lc.date}) ≠ footer 날짜(${ft.date})`);
    if (ft.ver && lc.ver && lc.ver !== ft.ver) fail(file, `LAST_CHECKED 버전(${lc.ver}) ≠ footer 버전(${ft.ver})`);
  } else if (!lc) {
    warn(file, 'LAST_CHECKED 주석 없음');
  }
  // 버전 지연(메인 대비)
  const canon = canonical[side];
  if (lc && lc.ver && canon && canon.ver && lc.ver !== canon.ver) {
    warn(file, `버전 지연 — 매뉴얼 ${lc.ver} vs 메인 타임라인 ${canon.ver}`);
  }

  // 2) 드로어 ↔ 패널 정합
  let drawer = undefined;
  try { drawer = parseDrawer(html); }
  catch (e) { fail(file, `COMMAND_DETAILS 파싱 오류 — ${e.message}`); }

  if (drawer && Object.keys(drawer).length) {
    const keys = new Set(Object.keys(drawer));
    const tokens = panelTokens(html);
    const tokenSet = new Set(tokens);

    // 죽은 행: 명령어형 패널 토큰인데 키 없음.
    // 레퍼런스(밀집 나열)에만 적용 — 플레이북 .cmd-badge는 결합/개념 라벨(예 "/model · /fast")이 의도적 정적이다.
    const isReference = /cheat-sheet|reference/.test(basename(path));
    if (isReference) {
      const dead = [...new Set(tokens.filter((t) => isCommandLike(t) && !keys.has(t)))];
      for (const t of dead) warn(file, `죽은 행 — 패널 "${t}" 에 대응하는 드로어 키 없음(클릭 불가)`);
    }

    // 고아 엔트리: 키인데 그 텍스트의 패널 셀 없음
    const orphan = [...keys].filter((k) => !tokenSet.has(k));
    for (const k of orphan) warn(file, `고아 엔트리 — 드로어 키 "${k}" 에 대응하는 패널 셀 없음`);

    return { keys: [...keys], drawer: true };
  }

  // 3) 패널 .cnt vs 실제 행 수 (숫자형만)
  for (const m of html.matchAll(/class="cnt">(\d+)<\/span>([\s\S]*?)(?=<span class="cnt">|<\/section>|<\/div>\s*<\/div>|$)/g)) {
    // (구조가 편마다 달라 best-effort — 노이즈 방지 위해 references/cheat-sheet에서만 신뢰)
  }
  return { keys: [], drawer: false };
}

// 패널 cnt 검사(별도 패스, cheat-sheet/full 구조 기준): <span class="cnt">N</span> … 다음 패널 전까지 .cmd 행 수.
function lintCnt(path) {
  const file = rel(path);
  const html = readFileSync(path, 'utf8');
  const heads = [...html.matchAll(/<div class="panel-head">([\s\S]*?)<\/div>\s*<div class="cmds[^"]*">([\s\S]*?)<\/div>\s*<\/section>/g)];
  for (const h of heads) {
    const cntM = h[1].match(/class="cnt">(\d+)<\/span>/);
    if (!cntM) continue; // "10+" 등 비숫자 cnt는 건너뜀
    const declared = Number(cntM[1]);
    // 레이아웃 채움용 빈/&nbsp; 행은 제외
    const rows = [...h[2].matchAll(/<div class="cmd"><code>([\s\S]*?)<\/code>/g)]
      .filter((r) => htmlText(r[1]) !== '');
    const actual = rows.length;
    if (actual && declared !== actual) warn(file, `패널 .cnt(${declared}) ≠ 실제 행(${actual})`);
  }
}

// 4) 허브 data-commands 검색 전수성: 링크된 페이지 키가 토큰에 있는지.
function lintHub(hubPath, side) {
  const file = rel(hubPath);
  const dir = dirname(hubPath);
  const html = readFileSync(hubPath, 'utf8');
  for (const card of html.matchAll(/<a class="card" href="([^"]+\.html)" data-commands="([^"]*)"/g)) {
    const [, href, dc] = card;
    const target = join(dir, href);
    if (!existsSync(target)) { warn(file, `허브 카드 href 없음 — ${href}`); continue; }
    let drawer;
    try { drawer = parseDrawer(readFileSync(target, 'utf8')); } catch { continue; }
    if (!drawer) continue;
    const tokens = [...new Set(dc.split(/\s+/).filter(Boolean))];
    const tokenSet = new Set(tokens);
    // 허브 검색은 부분 문자열 매칭이므로, (a) 키의 단어가 토큰에 있거나 (b) 길이 4+ 토큰이 키의 부분문자열이면
    // 검색 가능으로 본다. 예: "-s, --sandbox"→"--sandbox", "/mcp__서버__프롬프트"→"/mcp"·"/mcp__".
    const covered = (k) =>
      k.split(/[\s,]+/).filter(Boolean).some((w) => tokenSet.has(w)) ||
      tokens.some((t) => t.length >= 4 && k.includes(t));
    const missing = Object.keys(drawer).filter((k) => isCommandLike(k) && !covered(k));
    if (missing.length) warn(file, `검색 누락(${href}) — data-commands에 없는 키 ${missing.length}개: ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? ' …' : ''}`);
  }
}

// ---------- 실행 ----------
log(`# manual-lint @ ${canonical.ClaudeCode?.date || '?'}  (Claude ${canonical.ClaudeCode?.ver} / Codex ${canonical.Codex?.ver})\n`);

for (const side of ['ClaudeCode', 'Codex']) {
  log(`## ${side}`);
  const files = manualHtml(side);
  for (const path of files) {
    lintFile(path, side);
    if (basename(path) !== 'index.html') lintCnt(path);
  }
  lintHub(join(MANUAL, side, 'index.html'), side);
  log('');
}

log('---');
log(`FAIL ${failCount} · WARN ${warnCount}`);
log(failCount === 0 ? '✓ 차단 항목 없음 (WARN은 사람 검토 권장)' : '✗ FAIL 존재 — 커밋 전 수정 필요');
process.exit(failCount === 0 ? 0 : 1);
