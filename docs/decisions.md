# Architecture Decision Records

각 ADR: 의사결정 시점에 **왜** 그렇게 정했는지를 기록. 미래의 자신·다른 작업자가 "왜 이렇게 만들었지?"라고 물을 때 답하는 문서.

---

## ADR-001 · 단일 HTML zero-build

| 항목 | 값 |
|---|---|
| 날짜 | 2026-04-26 |
| 상태 | Accepted |

**Context**
빈 폴더에서 시작. 사용자 의도는 첨부 이미지의 단일 페이지 시각화. 향후 다른 곳에 보낼 수도 있고 본인이 더블클릭으로 열 수도 있어야 함.

**Decision**
번들러·프레임워크·CDN 없이 vanilla CSS/JS/SVG로 작성. 인라인 `<style>` + 인라인 `<script>`. 외부 의존성 0.

**Consequences**
- ✅ 의존성 깨질 일 없음
- ✅ `file://` 프로토콜로도 동작 (더블클릭 OK)
- ✅ GitHub Pages에 정적 호스팅
- ❌ 번들러가 주는 minify·tree-shaking 혜택 없음 (43KB index.html, 수용 가능)
- ❌ TypeScript 미지원 (대신 JSDoc으로 일부 타입 단서)

---

## ADR-002 · 카테고리별 데이터 분리 (data/*.js 8개)

| 항목 | 값 |
|---|---|
| 날짜 | 2026-05-17 (3차 작업) |
| 상태 | Accepted |

**Context**
214건이 되면서 단일 HTML 안에 EVENTS 인라인 배열이 220라인. 한 커밋의 diff에서 "데이터 1건 추가"인지 "렌더링 로직 변경"인지 구분 어려움. URL 검증 작업도 어디까지 됐는지 추적 곤란.

**Decision**
EVENTS를 카테고리별 8개 JS 파일(`data/cc.js`, `apps.js`, ..., `stl.js`)로 분리. 각 파일이 `window.EVENTS_BY_SOURCE[<key>]`에 push. `index.html`은 `<script src>`로 8개 로드 후 런타임 머지. `source` 필드는 파일명에서 자동 주입.

**대안**
- 단일 `events.json` + fetch: `file://` 프로토콜에서 CORS 막힘 → 더블클릭 호환 깨짐 → 기각
- Markdown 테이블 + 빌드 스크립트: 빌드 단계 추가 → ADR-001과 충돌 → 기각

**Consequences**
- ✅ 카테고리별 git diff 명료
- ✅ 데이터 추가 시 HTML 수정 불필요 (해당 `data/<key>.js`만 편집)
- ✅ 새 카테고리 추가도 단순 (`data/X.js` + SOURCES 키 + `<script src>` 1개)
- ⚠️ 8개 HTTP 요청 (로컬은 빠름, Pages는 HTTP/2로 다중화)

---

## ADR-003 · GitHub Public + Pages

| 항목 | 값 |
|---|---|
| 날짜 | 2026-05-17 |
| 상태 | Accepted |

**Context**
로컬 파일 → 다른 기기에서 못 봄. 백업도 없음. 검증 이력(언제 어떤 항목이 추가됐는가)도 메모리에만 있음. 사용자는 처음에 Private 저장소를 직관적으로 선호.

**Decision**
GitHub Public 저장소 (`prodoo/ClaudeUpdate_Timeline`) + GitHub Pages 호스팅. main branch / root.

**Why Public (Private 대신)**
1. **데이터 본질이 공개**: 모든 수록 데이터가 anthropic.com·GitHub 공개 페이지에서 가져온 정보. 비공개로 둘 가치 0.
2. **무료**: Pages는 Public 저장소만 무료. Private는 GitHub Pro($4/월) 필요.
3. **자동화 친화**: 향후 URL 헬스체크 GitHub Action도 Public이 무제한.

**Consequences**
- ✅ `https://prodoo.github.io/ClaudeUpdate_Timeline/` 공유 가능
- ✅ git log로 모든 변경 이력 추적
- ✅ 다른 기기에서 clone으로 작업 이어가기
- ⚠️ 시각화 코드가 외부에 노출됨 (코드 자체에 비밀 없음 → OK)

---

## ADR-004 · 추정 거부 정책

| 항목 | 값 |
|---|---|
| 날짜 | 2026-04-26 |
| 상태 | Accepted (Hard rule) |

**Context**
1차 빌드 시 4개 카테고리(Apps/API/Red Team/Corporate)가 "공식 페이지 접근 불가" 보고에 따라 패턴 기반 추정 데이터로 채워짐. 사용자가 1차 빌드 후 명시적으로 거부:

> "대부분 추정하지말고 정확히 매칭 시켜"

**Decision**
모든 데이터는 출처 페이지에서 직접 확인된 항목만 수록. `(추정)`, `(가정)`, `(추측)` 같은 라벨 사용 금지. 검증 못 한 항목은 빼는 것이 낫다.

**예외**
- Stealth 카테고리: 본질적으로 비공식 (소스맵 유출 분석). 출처 URL을 함께 명시하면 OK. 일부 항목 `(커뮤니티 추정)` 표시 허용.

**Consequences**
- ✅ 213 → 200 → 214로 변동 있어도 모두 검증된 데이터
- ✅ 사용자 신뢰 확보
- ⚠️ 데이터 수집 시간 더 걸림 (WebFetch 필수)
- 영구 메모리: `memory/feedback_data_accuracy.md`

---

## ADR-005 · URL 정확도 — anchor·slug까지

| 항목 | 값 |
|---|---|
| 날짜 | 2026-05-17 (3차 작업) |
| 상태 | Accepted |

**Context**
3차 작업 시작 시점에 api 24건이 `https://platform.claude.com/docs/en/release-notes/api`로만, corp 10건이 `https://www.anthropic.com/news`로만 링크. 총 34건이 카테고리 일반 페이지로만 가서 클릭 후 사용자가 직접 찾아야 했음. 사용자 지적:

> "지금 모든 정보를 100% 검증한 것도 아니지 않나?"

**Decision**
모든 url 필드가 anchor(`#january-29-2026`) 또는 개별 글 slug(`/news/<slug>`) 수준까지 매칭. 일반 카테고리 페이지 URL은 사용 금지.

**구현**
- api: `platform.claude.com` 페이지 anchor 패턴(`#month-day-year`) 확인 후 일괄 적용
- corp: WebFetch + WebSearch로 9건 slug 모두 발견

**Consequences**
- ✅ 버블 클릭 → 해당 발표/릴리스 노트 글로 직행
- ✅ 검증 명확 (URL이 정확하면 그 출처에서 확인 가능)
- 영구 메모리: `memory/reference_anthropic_sources.md`

---

## ADR-006 · 라벨 zoom-aware + 충돌 회피

| 항목 | 값 |
|---|---|
| 날짜 | 2026-05-17 (4차 작업) |
| 상태 | Accepted |

**Context**
배포 후 스크린샷에서 cc lane(1~4월 빽빽), Research lane(같은 날 4~5건), Stealth lane(3/31 7건 한 점)에서 라벨 텍스트 누적·중첩. 원인:
- 모든 zoom 레벨에서 임계값 고정(`imp >= 4`)
- 라벨 X 좌표 충돌 검사 없음
- 라벨 텍스트 길이 36자 → dense 구간에서 옆 항목 침범

**Decision**
- **Zoom-aware 임계값**: 1×/2× = imp 5만, 4× = imp 4+, 8× = imp 3+
- **충돌 회피**: lane별 placed labels 배열, X 거리 < `LABEL_MIN_DX` (90px)면 skip. importance 내림차순으로 우선 배치.
- **검색 모드**: 검색어 활성화 시 zoom 임계값 무시, 매치된 항목 모두 라벨 (검색 의도와 부합)
- **라벨 컷**: 36자 → 20자 (호버 툴팁에서 풀 제목 유지)

**대안**
- Hover-only (평시 0 라벨): 한눈 파악 가치 손실 → 기각
- 임계값 고정 imp 5: zoom 4×/8×에서 정보 부족 → 기각
- Leader line + stagger: 구현 복잡, dense 구간에서 결국 겹침 → 기각

**Consequences**
- ✅ 1× 깔끔, zoom-in 시 점진적 정보 노출
- ✅ 라벨끼리 ≥90px 간격 보장
- ⚠️ 같은 lane에 imp 5가 5+개 몰리면 일부 라벨 skip — 호버로 보완

---

## ADR-007 · Multi-page 구조 (Claude + Codex)

| 항목 | 값 |
|---|---|
| 날짜 | 2026-05-17 |
| 상태 | Accepted |

**Context**
저장소 이름이 `ClaudeUpdate_Timeline`이지만, 사용자가 OpenAI Codex 업데이트도 같은 저장소·같은 디자인 언어로 시각화하길 원함. 기존 `index.html`은 Claude 8개 카테고리 224건 / 134일 범위에 맞춰 빌드돼 있고 그대로 두고 싶음.

**Decision**
**Per-domain 단일 페이지** 분리:
- `index.html` ← Claude 2026
- `codex.html` ← Codex 2025–26
- `data/` ← Claude 8개 .js (변경 없음)
- `data/codex/` ← Codex 6개 .js (신규)
- 두 페이지 모두 동일 markup의 `<nav class="page-toggle">` 보유 (활성 페이지만 다름)
- CSS와 JS는 양 페이지에 인라인 중복 (ADR-001 zero-build 유지)

**대안**
- **단일 페이지 + 카테고리 필터**: lane 8+6=14개 과부하, 두 도메인의 시간 범위·이벤트 밀도가 달라 시각적 합치 어려움 → 기각
- **shared.js / shared.css 외부 파일**: zero-build 정책(ADR-001) 충돌, `file://` 더블클릭 호환 깨짐 → 기각
- **별도 저장소(`CodexUpdate_Timeline`)**: 사용자가 같은 저장소 명시. URL 분리 시 두 페이지 토글 UX 불가능 → 기각

**Consequences**
- ✅ 두 페이지 독립적 시간 범위·컬러·카테고리·다크 모드 상태(`localStorage` 키 분리: `c2026-dark` vs `codex2026-dark`)
- ✅ 데이터 무결성 (codex.html은 Claude data 미로드, vice versa)
- ✅ 헤더 토글로 한 클릭 전환
- ✅ ADR-002 데이터 분리 정책을 Codex에도 동일 적용 (`data/codex/{cli,app,models,platform,blog,corp}.js` 6개)
- ⚠️ CSS·JS 일부 중복 (~30KB) — index.html 변경 시 codex.html 수동 동기화 필요
- ⚠️ Codex Platform 카테고리는 changelog month anchor만 가능(ADR-005 정밀도 정책 부분 예외) — `docs/codex-sources.md` 명시

**Platform 카테고리 URL 정밀도 예외**
- `developers.openai.com/codex/changelog`는 항목별 anchor 없이 `#month-YYYY-MM` 월 수준 anchor만 제공
- Codex Platform 8건은 이 month anchor 사용 — ADR-005 100% slug 정책 부분 미달이지만 출처 자체는 공식이며 추정 아님
- 같은 사건이 GitHub release에도 있으면 CLI 카테고리에서 tag anchor URL 사용 (이중 등록 OK)

**index.html 변경 최소화 원칙**
헤더 토글 markup(`<nav class="page-toggle">`) + CSS 규칙(`.page-toggle`, `.pg-tab`, `.pg-tab.active`)만 추가. 데이터·렌더링·인터랙션·SOURCES 등 일체 변경 없음.

---

## ADR-008 · Codex → ChatGPT 페이지 리브랜드 + 9 lane + 밀도 보강

| 항목 | 값 |
|---|---|
| 날짜 | 2026-05-17 |
| 상태 | Accepted |

**Context**
v1(`Codex 2025-26` / 6 lane / 59건) 출시 후 사용자 피드백:
- Claude 페이지(Anthropic 전체 8 lane / 224건) 대비 비대칭 — Claude는 Anthropic 우산, Codex는 Codex 제품만
- GPT-Realtime 2 / GPT-Realtime-Translate 등 OpenAI 광역 발표가 누락됨
- 데이터 밀도가 1/4 수준 (59 vs 224)

**Decision**
- 페이지명 `Codex 2025-26` → **`ChatGPT 2025-26`** (OpenAI 브랜드 우산 중 가장 인지도 높은 단일 이름)
- lane 6 → **9** (`GPT Models` + `Research` + `Community` 신설, `Models` → `Codex Models`로 명칭화)
- 데이터 보강 패키지 A+C+D 적용:
  - **A**: CLI에 모든 검증 가능한 stable rust-vX.Y.Z 추가 (22 → 58)
  - **C**: openai.com/index 추가 발표 (App·Corp 보강)
  - **D**: `Community` lane 신설 (외부 보도·커뮤니티 분석)
- 데이터 폴더 `data/codex/` 그대로 유지 (rename은 git 노이즈만 만들고 가치 0)
- 다크모드 localStorage 키 `codex2026-dark` 유지 (페이지 식별자 손상 방지)
- 결과: **131건** (59 → 131, +122%). Claude 224에 더 근접하는 밀도.

**대안**
- A. Models lane 확장만 → lane 의미 흐려짐, 기각
- B. GPT lane만 신설, 페이지명 유지 → 브랜드 우산 비대칭 잔존, 기각
- 페이지명 `OpenAI 2025-26` → 회사명이라 무미, `ChatGPT`가 사용자에게 더 친숙, 기각
- B' 패키지(changelog 월별 확장) → month anchor 정밀도 한계로 가치 대비 비용 낮음, 미선택

**Consequences**
- ✅ Claude ↔ ChatGPT 브랜드 우산 진짜 대칭
- ✅ 131건으로 Claude 224건에 더 근접하는 밀도
- ✅ GPT-Realtime/o-series/Community 분석 등 코딩 인접 OpenAI 활동 흡수
- ✅ Codex 메인 thread 비중 유지 (CLI 58 + App 7 + Codex Models 9 = 74건, 56%)
- ⚠️ 파일 경로 (`data/codex/`, `codex.html`)는 그대로 — 사용자 가치 없는 rename 회피
- ⚠️ ChatGPT consumer 앱 기능(메모리/custom GPTs) / Sora·DALL-E 멀티모달은 의도적 제외 (사용자 명시 — 코딩 thread 유지)
- ⚠️ lane 9개로 SVG 세로 +190px, monthly view 14개월 그대로
- ⚠️ Platform lane만 `developers.openai.com/codex/changelog` month anchor 정밀도 예외 (ADR-007 그대로 적용)

**Community lane 검증 정책**
ADR-004(추정 거부) + ADR-005(URL 정확도)는 그대로 적용. 추가로:
- `(커뮤니티 분석)` 라벨 허용 (Claude의 Stealth lane과 동일)
- `(추정)`/`(추측)` 라벨 금지
- 출처 URL은 외부 보도(techcrunch, cerebras.ai, github.blog 등) 또는 HackerNews item id까지 명시

---

## 결정 영향 매트릭스

| ADR | Pages 호환 | 더블클릭 호환 | git 이력 명료 | 데이터 신뢰 |
|---|---|---|---|---|
| 001 zero-build | ✅ | ✅ | – | – |
| 002 데이터 분리 | ✅ | ✅ | ✅✅ | – |
| 003 Public+Pages | ✅✅ | – | ✅ | – |
| 004 추정 거부 | – | – | – | ✅✅ |
| 005 URL 정확도 | – | – | – | ✅✅ |
| 006 라벨 전략 | ✅ | ✅ | – | – |
| 007 multi-page | ✅ | ✅ | ✅ | – |
| 008 ChatGPT 리브랜드 + 9 lane | ✅ | ✅ | ✅ | ✅ |

모든 ADR이 핵심 가치(zero-build · git · 신뢰)와 정합.
