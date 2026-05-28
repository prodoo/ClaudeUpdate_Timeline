# UPDATE_PLAYBOOK.md

> Claude Code 또는 ChatGPT Codex의 신규 기능·명령어를 매뉴얼 시리즈와 메인 타임라인에 반영할 때, 이 문서 단계대로 진행한다. 새 세션이 이 문서 하나만 보고도 작업을 완수할 수 있도록 자족적으로 작성됨.

작성 기준일: **2026-05-28**
참조: 루트 `CLAUDE.md`, `update todo/ClaudeCode/CLAUDE.md`, `update todo/Codex/CLAUDE.md`, 메모리 `MEMORY.md`.

---

## 0. 한 줄 요약

자유 프롬프트("조사해서 추가해")로 진입해도 이 문서의 단계 0~5를 그대로 따른다. 출처는 §3 WATCHLIST의 "마지막 본 기준점" 이후만, 패치 대상은 §4 파일 매핑표 그대로, 보존 영역은 §5, 회피해야 할 함정은 §6 LESSONS.

진입 단축어 예시(아직 슬래시화 안 됨): `/update claude` 또는 `/update chatgpt`. 안정화 후 실제 슬래시 명령어로 등록 검토.

---

## 1. 진입 전 점검

1. 현재 작업 디렉토리가 git 정상 상태인지 (`git status` 클린).
2. 기준일 대비 어느 시리즈를 갱신할지 결정 (Claude / ChatGPT / 둘 다).
3. 메모리 `feedback_data_accuracy`·`feedback_official_terminology` 활성. 추정 금지·공식 docs 용어 준수.

---

## 2. 단계별 워크플로

### 0. 스냅샷 (현재 상태 파악)

```
grep -n "LAST_CHECKED" index.html codex.html "update todo"/**/*.html
```

- 20개 파일의 `<!-- LAST_CHECKED: YYYY-MM-DD ... -->` 한 줄씩 한눈에 식별.
- 가장 뒤처진 파일 = 우선 갱신 대상.
- 메뉴얼 footer의 "YYYY년 M월 D일 기준 · vX.X.X" 스탬프도 동시에 확인.

### 1. 신규 항목 추출 (출처별 기준점 이후)

§3 WATCHLIST의 "마지막 본 SHA·버전" 이후 변경분만 fetch. 이 기준점 덕분에 changelog 전체 재읽기 불필요.

- Claude Code: `code.claude.com/docs` + Anthropic 공식 CHANGELOG·블로그 (메모리 `reference_anthropic_sources`).
- ChatGPT/Codex: OpenAI changelog + GitHub `openai/codex` (메모리 `reference_openai_codex_sources`). `openai.com` 직접 fetch는 403이 잦으므로 GitHub mirror 우선.

추출 결과를 표로 정리:
| 항목 | 종류 | 출처 URL | 공개 빌드 여부 |
|---|---|---|---|

### 2. 분류

- **A. 신규 명령어·기능** — 레퍼런스 패널 추가 + 플레이북 영향 검토.
- **B. 기존 동작 변경** — 해당 플레이북 카드 `.kv`·`.example`·캐비엇 갱신.
- **C. 폐기** — 본문에서 제거, 필요 시 캐비엇으로만 언급.
- **D. 버전 스탬프만** — footer + `LAST_CHECKED` 갱신만으로 종료.

### 3. 파일 매핑표 따라 패치

§4 표 참조. 영향 파일 일괄 grep으로 사전 확인하고 동일 패턴이면 일괄 Edit.

### 4. footer 스탬프 + LAST_CHECKED 갱신

모든 영향 파일에서 동기 업데이트:
- footer 안 "YYYY년 M월 D일 기준 · vX.X.X" → 새 날짜·버전.
- `<!-- LAST_CHECKED: YYYY-MM-DD vX.X.X -->` → 동일 값으로 통일.
- §3 WATCHLIST 표의 "마지막 본 SHA·버전" 컬럼도 같이 갱신.

### 5. 검증 + 커밋

- 영향 매뉴얼 1~2편 브라우저 더블클릭으로 시각 회귀 확인.
- 다크/라이트 토글, cmd-detail 드로어(플레이북 12편), 허브 검색(허브 2편) 정상 동작.
- 커밋 메시지 템플릿:
  ```
  data(<scope>): <한 줄 요약 (신규 N개 / 변경 N개 / 폐기 N개)>

  - <항목별 요약>
  - footer 스탬프 갱신 (vX.X.X → vY.Y.Y)
  - LAST_CHECKED 동기

  Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
  ```

---

## 3. WATCHLIST (출처별 기준점)

| 출처 | URL/위치 | 마지막 본 SHA·버전 | 마지막 확인일 |
|---|---|---|---|
| Claude Code 공식 docs | `code.claude.com/docs` (메모리 `reference_anthropic_sources`) | v2.1.141 | 2026-05-28 |
| Anthropic CHANGELOG·블로그 | 동상 | (첫 사이클에서 SHA 채움) | 2026-05-28 |
| OpenAI ChatGPT 공식 안내 | (메모리 `reference_openai_codex_sources`) | v0.130.x 계열 | 2026-05-28 |
| GitHub `openai/codex` | github.com/openai/codex | (첫 사이클에서 commit SHA 채움) | 2026-05-28 |
| `@openai/codex-sdk` (npm) | 동기 패키지 버전 핀 | 0.130.0 | 2026-05-28 |

*WATCHLIST의 SHA·버전 컬럼은 첫 운영 사이클에서 정확한 값으로 채운다.*

---

## 4. 파일 매핑표 (변경 → 파일)

### 메인 타임라인 측

| 변경 종류 | 영향 파일 |
|---|---|
| Claude 새 이벤트(릴리스·기능 발표) | `data/*.js` (Claude 측 데이터) + 필요 시 `index.html` 레인 수·footer 스탬프 |
| ChatGPT 새 이벤트 | `data/*.js` (ChatGPT 측) + 필요 시 `codex.html` 레인 수·footer 스탬프 |
| 디자인 토큰·인터랙션 변경 | `index.html`·`codex.html` 인라인 `<style>`/`<script>` (사이트 SSOT 검토 후) |

### 매뉴얼 측

| 변경 종류 | 영향 파일 |
|---|---|
| 신규 슬래시 명령어 (Claude) | `update todo/ClaudeCode/claude-code-cheat-sheet.html` 또는 `cheat-sheet-full.html` 패널 + 해당 워크플로 관련 플레이북 카드 검토 |
| 신규 슬래시 명령어 (Codex) | `update todo/Codex/codex-cli-reference-essentials.html` 또는 `codex-cli-reference-complete.html` 패널 + 관련 플레이북 카드 |
| 기존 명령어 동작 변경 | 해당 플레이북의 6카드 중 영향 카드의 `.lead`·`.kv`·`.example` 갱신 |
| 폐기 | 본문에서 제거, footer 캐비엇에 폐기 사실만 1줄 |
| 신규 카테고리 (예: Claude G 원격&멀티디바이스 플레이북) | 신규 플레이북 HTML 1편. 절차는 `update todo/ClaudeCode/CLAUDE.md` §4 그대로 |
| 매뉴얼 시리즈 진입 동선 변경 | `update todo/ClaudeCode/index.html`·`update todo/Codex/index.html` 허브 카탈로그 카드 |
| 버전 스탬프만 | 영향 파일들의 footer + `<!-- LAST_CHECKED -->` 일괄 갱신 |

---

## 5. 보존 영역 (절대 깨면 안 되는 것)

루트 `CLAUDE.md §3`과 동일. 업데이트 작업 시에도 다음을 지킨다:

1. 매뉴얼 본문 16편의 인라인 `<style>` 블록은 변경 금지. 색조·다크 모드 변경은 `_shared/manual-theme.css`에서 override.
2. `localStorage` `theme` 단일 키로 사이트 전체 모드 동기화. 새 페이지 추가 시 동일 키 사용.
3. `_shared/cmd-detail.{css,js}` 셀렉터·계약 유지 (플레이북 12편 의존).
4. 6단계 액센트 토큰 `--c1`~`--c6c` 색조·의미 보존. 6번 변수명만 `--c6c`.
5. 본문 매뉴얼 패치는 `_shared/` 신규 자산 추가가 1순위 — 본문 직접 수정은 최후 수단.

---

## 6. LESSONS (그동안의 교훈)

다크모드·랜딩 통합·SSOT 채우기 사이클에서 확인된 실전 노하우:

- **공유 자산 override 우선**: 본문 N편에 같은 변경이 필요할 때 `_shared/` 신규 파일 1개로 처리 가능하면 그 방법이 회귀 위험 최소. 본문 직접 수정은 마지막 옵션.
- **패턴 단일성 사전 grep**: 동일 패턴 N편 일괄 Edit 전 grep으로 패턴이 한 가지인지 확인. 분기가 있으면 분기별 Edit. 16편 head/body가 완전 동일 패턴이라 32 Edit 일괄 처리한 사례.
- **trust-but-verify**: 핸드오프·CLAUDE.md가 "X 키 통일됨"이라 단언해도 실제 grep 결과가 다를 수 있다. 핵심 상수·키·셀렉터는 패치 전 직접 grep 확인. 메인 두 편의 `localStorage` 키가 분산되어 있었던 사례.
- **outlier 파일 별도 점검**: 한 파일에만 있는 고유 토큰(예: `cheat-sheet.html`의 `--panel`)이 일괄 override에서 누락될 수 있다. 다크/색상 변경 후 한 파일씩 시각 검증 시 outlier가 드러난다.
- **인라인 style 한정**: 본문 HTML 안에 인라인 `style="..."`로 색상이 지정된 경우 외부 CSS의 `[data-theme="dark"]` 셀렉터로 잡히지 않는다. `!important` 우회 또는 본문 직접 수정이 필요 (§5 보존 원칙의 예외).
- **UI 검증은 더블클릭**: 타입 체크·테스트 통과는 기능 완성을 의미하지 않는다. 시각·동기화·회귀는 브라우저에서 직접 확인. 검증하지 못한 부분은 보고서에 명시.
- **공식 출처 검증 우선**: 추정 항목 금지. 1순위 출처는 공식 docs, 2순위 공식 블로그·CHANGELOG, 3순위 최근 가이드. 자료 간 불일치 항목은 캐비엇으로 분리. 메모리 `feedback_data_accuracy` 영구 반영.
- **공식 docs 용어 SSOT**: 매뉴얼 본문 콘텐츠는 한국어 공식 docs의 단어·용어를 그대로 사용. 비공식 직역 금지. 메모리 `feedback_official_terminology` 영구 반영.

---

## 7. 메타 주석 (LAST_CHECKED)

매뉴얼 18편 + 메인 2편 = 20개 파일 모두 `<footer>` 직전에 한 줄:

```html
<!-- LAST_CHECKED: YYYY-MM-DD vX.X.X -->
```

- `YYYY-MM-DD`: 마지막 사이클 종료일.
- `vX.X.X`: 해당 매뉴얼 시리즈의 기준 버전 (Claude는 `v2.1.141` 계열, Codex는 `v0.130.x` 계열, 메인 타임라인은 버전 생략 가능).
- HTML 주석이므로 사용자 화면에 노출되지 않는다.
- §2 단계 0의 `grep -n "LAST_CHECKED"` 한 번으로 가장 뒤처진 파일을 즉시 식별.

---

## 8. 진입 단축어 (옵션 / 추후)

- 슬래시 `/update claude` 또는 `/update chatgpt` 등록 검토.
- 안정화 기준: 운영 사이클 2~3회 통과 + WATCHLIST 컬럼 안정화.
- 등록 위치: 사용자 글로벌 `~/.claude/commands/` 또는 프로젝트 `.claude/commands/`.

---

*이 문서는 자족적이다. 새 세션이 이 문서와 메모리만으로 업데이트 사이클 1회를 완수할 수 있어야 한다. 절차상 막힘이 발생하면 LESSONS에 1줄 추가하고 다음 사이클에 반영한다.*
