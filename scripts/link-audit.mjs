/* link-audit.mjs — 타임라인 이벤트의 url↔내용 정합을 정적으로 추린다.
 *
 * snapshot.mjs 가 레인별 드리프트를 본다면, 이 스크립트는 "버블 클릭 → 새 탭 url"의
 * 설명-링크 불일치 후보를 추려낸다. index.html/codex.html 의 showTip(title+summary)·
 * openLink(url)은 동일 data-evt 를 읽으므로, 불일치는 데이터(url)의 문제다.
 *
 * 분류 (severity 아님 — 사람 판정용 트리아지):
 *   [HUB]   changelog·release-notes·whats-new·도메인 루트 — 여러 이벤트가 공유해도
 *           정당하다(거칠지만 맞는 페이지). 정보용으로만 집계.
 *   [DUP!]  비-허브 url 을 2건+ 이벤트가 공유 — 제목이 서로 다르면 오링크 의심(1순위).
 *           스크립트는 자동 판정하지 않고 제목을 나열해 사람이 동일주제/오링크를 가른다.
 *   [SOLO?] 단일 이벤트인데 특정 기사 url 의 슬러그가 (title+summary) 와 4자+ 토큰을
 *           하나도 공유하지 않음 — 저신뢰 후보(공식 release-notes 식 url 은 정상 다수).
 *
 * 읽기 전용 · 콘솔 전용(파일 미생성). 실행: node scripts/link-audit.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 한 디렉토리의 data 파일을 vm 샌드박스(window 셰임)에서 평가해 이벤트를 모은다.
function loadAll(dir, side) {
  const out = [];
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.js'))) {
    const ctx = { window: {} };
    vm.createContext(ctx);
    vm.runInContext(readFileSync(join(dir, f), 'utf8'), ctx, { filename: join(dir, f) });
    const ebs = ctx.window.EVENTS_BY_SOURCE || {};
    for (const lane of Object.keys(ebs)) for (const e of ebs[lane]) out.push({ side, lane, file: f, ...e });
  }
  return out;
}

const events = [
  ...loadAll(join(ROOT, 'data'), 'claude'),
  ...loadAll(join(ROOT, 'data', 'codex'), 'codex'),
];

// HUB: 여러 항목이 공유해도 정당한 집계/색인 페이지.
function isHub(u) {
  if (/changelog|release-notes|whats-new/i.test(u)) return true;
  try { if (new URL(u).pathname.replace(/\/+$/, '') === '') return true; } catch {} // 도메인 루트
  return false;
}

const toks = (s) => new Set((s || '').toLowerCase().match(/[a-z0-9]{4,}/g) || []);
const slugToks = (u) => {
  try { const x = new URL(u); return ((x.pathname + ' ' + x.hash).toLowerCase().match(/[a-z0-9]{4,}/g) || []); }
  catch { return (u.toLowerCase().match(/[a-z0-9]{4,}/g) || []); }
};

const byUrl = new Map();
for (const e of events) {
  const u = e.url || '(empty)';
  if (!byUrl.has(u)) byUrl.set(u, []);
  byUrl.get(u).push(e);
}

const empty = byUrl.get('(empty)') || [];
const dupNonHub = [];
const dupHub = [];
for (const [u, arr] of byUrl) {
  if (u === '(empty)' || arr.length < 2) continue;
  (isHub(u) ? dupHub : dupNonHub).push([u, arr]);
}
dupNonHub.sort((a, b) => b[1].length - a[1].length);

const solo = [];
for (const [u, arr] of byUrl) {
  if (u === '(empty)' || arr.length !== 1 || isHub(u)) continue;
  const st = slugToks(u);
  if (!st.length) continue;
  const tt = toks(arr[0].title + ' ' + (arr[0].summary || ''));
  if (!st.some((w) => tt.has(w))) solo.push([u, arr[0]]);
}

// BUNDLE: 항목이 아니라 묶음 페이지(주차 다이제스트)를 가리켜 클릭 시 페이지 맨 위로 착지하는 이벤트.
//   버전이 있으면 code.claude.com/docs/ko/changelog#{maj}-{min}-{patch} 로, 없으면 doc 딥링크로 정밀화한다.
const bundle = events.filter((e) => /whats-new\/\d{4}-w\d+/.test(e.url || ''));

// ---------- 출력 ----------
console.log(`# link-audit — ${events.length} events · ${byUrl.size} urls · empty=${empty.length}\n`);

console.log(`## BUNDLE 묶음-페이지 링크(주차 다이제스트 — 항목 착지 아님, changelog#anchor 로 정밀화 권장) — ${bundle.length}`);
for (const e of bundle) console.log(`  [${e.file.replace('.js', '')}/${e.lane}] ${e.date}  ${e.title}${e.version ? '  (' + e.version + ')' : ''}`);
console.log('');

console.log(`## DUP! 비-허브 url 공유 — ${dupNonHub.length} 그룹 (제목이 무관하면 오링크 의심)`);
for (const [u, arr] of dupNonHub) {
  console.log(`\n  ${arr.length}x  ${u}`);
  for (const e of arr) console.log(`      [${e.side}/${e.lane}] ${e.date}  ${e.title}`);
}

console.log(`\n## SOLO? 단일·비허브·슬러그↔내용 토큰 0 — ${solo.length} (저신뢰)`);
for (const [u, e] of solo) console.log(`  [${e.side}/${e.lane}] ${e.date}  ${e.title}\n      → ${u}`);

console.log(`\n## HUB 공유(정당 — 집계/색인) — ${dupHub.length} 그룹 / ${dupHub.reduce((s, [, a]) => s + a.length, 0)} 건 [정보용]`);
for (const [u, arr] of dupHub.sort((a, b) => b[1].length - a[1].length)) console.log(`  ${arr.length}x  ${u}`);

console.log(`\n읽기 전용 · 콘솔 전용. 의심 항목은 공식 출처(reference_* 메모리)로 대조 후 url 교정.`);
