# Codex CLI 치트시트 시리즈 — 인수인계 문서 (CLAUDE.md)

> 이 문서 하나로 새 세션에서 작업을 이어갈 수 있도록, 파일 인벤토리·디자인 규격·검증 상태·주의점·잔여 작업을 자족적으로 담았다. 별도 첨부 없이 동작한다.

---

## 1. 프로젝트 개요

- **무엇**: OpenAI **Codex CLI** 사용 노하우를, 단일 파일 HTML 페이지 시리즈로 제작.
- **두 계열**:
  - **레퍼런스 계열** — 명령어를 빠짐없이 훑는 나열형 (밀집 그리드).
  - **플레이북 계열** — 명령어를 적게 골라 "언제 쓰나 / 무엇에 주의하나 / 실전 예시"까지 깊게 파는 심화 코칭형 (6카드 서사 아크).
- **제약**: 전부 한국어, 빌드 도구·프레임워크 없는 **정적 단일 HTML**, CDN 폰트만 사용.
- **상태**: 시리즈 **완결** (7개 파일). 디자인 템플릿은 플레이북 ①에서 확정 후 전 편 동일 유지.

---

## 2. 파일 인벤토리

| # | 파일명 | 계열 | 주제 | 상태 |
|---|---|---|---|---|
| 1 | `codex-cli-playbook-01-setup.html` | 플레이북 | 환경 세팅 — 처음 켜서 일할 환경 만들기 | ✅ |
| 2 | `codex-cli-playbook-02-task-flow.html` | 플레이북 | 한 작업 완주 — 계획부터 검증까지 한 흐름 | ✅ |
| 3 | `codex-cli-playbook-03-automation.html` | 플레이북 | 비대화형 자동화 — 사람 없이 굴리기 | ✅ |
| 4 | `codex-cli-playbook-04-context-threads.html` | 플레이북 | 컨텍스트·멀티스레드 — 대화 흐름 관리 | ✅ |
| 5 | `codex-cli-playbook-05-permissions.html` | 플레이북 | 권한·보안 심화 — 안전하게 풀어주기 | ✅ |
| 6 | `codex-cli-reference-essentials.html` | 레퍼런스 | 핵심판 — 기능별 대표 명령어 (패널 A~E) | ✅ |
| 7 | `codex-cli-reference-complete.html` | 레퍼런스 | 전체판 — 공개 명령어 전수 (패널 A~H + 버전 의존 스트립) | ✅ |

### 각 플레이북의 6카드 구성

- **① 환경 세팅**: `codex`(설치·인증) → `/model·/fast` → `/permissions` → `/init` → `config.toml` → `/status·/debug-config`
- **② 한 작업 완주**: `/plan` → `Enter·Tab`(실행 중 끼어들기) → `/diff` → `/review` → `/compact` → `/resume`
- **③ 비대화형 자동화**: `codex exec` → `--json·--output-last-message` → `--sandbox·-a never` → `codex mcp` → `Skills·Hooks` → `codex cloud·apply`
- **④ 컨텍스트·멀티스레드**: `/new·/clear` → `/fork` → `/side` → `/agent` → `/resume` → `/title·/statusline`
- **⑤ 권한·보안 심화**: `--sandbox` → `-a/--ask-for-approval` → `permission profiles` → `/experimental`(Smart Approvals) → `/sandbox-add-read-dir` → `/debug-config`

### 레퍼런스 패널 구성

- **핵심판**: A 세션 조종 / B 컨텍스트·스레드 / C 검토·파일 / D 핵심 서브커맨드 / E 자주 쓰는 플래그
- **전체판**: A 세션·모델 / B 권한·샌드박스 / C 컨텍스트·스레드 / D 검토·파일 / E 도구·확장 / F UI·진단·종료 / G `codex` 서브커맨드(wide) / H CLI 글로벌 플래그(wide) + 하단 "버전 의존" 스트립

---

## 3. 디자인 규격 (재현용)

> **중요**: 새 편을 만들 땐 기존 HTML 파일 1개를 복사해 **내용만 교체**한다. CSS는 편마다 바꾸지 않는다. 아래는 그 CSS를 잃었을 때를 위한 자족적 명세.

### 3.1 폰트 (`<head>`)

- 본문: **Pretendard** — `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css`
- 모노: **JetBrains Mono** (500/700) — Google Fonts
- `--mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;`

### 3.2 색상 토큰 (`:root`)

```css
/* 중립 */
--navy:#1c2433;  --navy2:#283448;  --ink:#222831;
--gray:#5f6b7a;  --soft-gray:#8b95a3;
--line:#e7e9ee;  --bg:#ffffff;     --soft:#f4f5f8;
--page:#dfe3ea;  /* 페이지 배경 */

/* 6단계 액센트 */
--c1:#2bb3a3 / --c1bg:#e4f5f3   (teal)
--c2:#3f6fd1 / --c2bg:#e7eefb   (blue)
--c3:#5b6ee0 / --c3bg:#e9ebfc   (indigo)
--c4:#e09a2d / --c4bg:#fbf0db   (amber)
--c5:#2f9e6e / --c5bg:#e3f4ec   (green)
--c6c:#e0594d / --c6bg:#fbe7e4  (red)  ← 6번만 변수명이 --c6c (혼동 주의)
```

- 플레이북 상세 카드 1~6은 `--c1 … --c6c` 순서 고정.
- 플레이북 요약 카드 3장은 `c1·c3·c5`를 구간 대표색으로.
- 레퍼런스 패널은 A부터 `c1·c2·c3·c4·c5·c6c` 순, 패널이 6개를 넘으면 색 재사용.

### 3.3 플레이북 레이아웃 골격 (심화 카드형)

```
.sheet (max-width:1180px, 흰 배경, radius 6px, 그림자, 가운데 정렬)
└─ .hero            다크(navy) 배경, padding 34px 38px 40px, flex 좌우 분할
   │  .hero-left:   .eyebrow(영문 대문자, letter-spacing .22em) + h1(41px, 800) + h1>.sub
   │  .summary-box: width 392px, navy2 배경, border #3a4860, radius 10px
   │     └─ .thesis(주제문 1~2줄) + .mini(grid 2열: code 6개 + 영문 설명)
   └─ .body (padding:24px 26px 30px)
      ├─ .sumrow    요약 카드 3장 (grid 3열, gap 16px, 카드 상단 3px 컬러 보더)
      │   └─ .sumcard.s1/.s2/.s3 : .step(STEP 1—2 등 모노) + h3 + p
      └─ .grid      상세 카드 6장 (grid 2열, gap 18px)
          └─ .card.k1 … .k6 (흰 배경, border, radius 10px, padding 20px 22px 22px, flex column)
             ├─ .card-top : .cmd-badge(컬러 배경 배지) + .tag(우측 라운드 pill)
             ├─ h2 (19px, 800)
             ├─ .lead (13px, 2~3문장, <b>·<code> 사용)
             ├─ .rows : .kv 3행, 각 행 grid [라벨 78px | 값]
             └─ .example : 다크(navy) 박스, margin-top:auto
                          .ex-lbl("실전 예시") + .ex-body(모노, white-space:pre-wrap)
      footer        좌: .arc(6단계 아크 요약) / 우: .stamp(날짜·버전 + 캐비엇)
```

### 3.4 레퍼런스 레이아웃 골격 (밀집 그리드형)

```
.sheet (플레이북과 동일)
└─ .hero            다크(navy), 좌 .hero-left(eyebrow + h1 + .sub) / 우 .hero-note(요약문 박스)
   └─ .body
      ├─ (전체판만) .legend  : EXP/WIN/DEP 라벨 범례
      ├─ .panels  grid-template-columns:repeat(6,1fr), gap 14~16px
      │   └─ .panel       기본 grid-column:span 2 (= 6열 그리드에서 3개/행)
      │       .panel.wide grid-column:span 6 (전체판 G·H용)
      │       .panel.a … .h : 색상 토큰 매핑
      │       ├─ .panel-head : .badge(컬러 letter A~H) + .panel-title(+.en 영문)
      │       └─ .rows / .rows.two(wide 패널은 2열) : .row = grid [code | .desc]
      ├─ (전체판만) .labelstrip : "버전 의존 · 공식 슬래시 문서 미수록" (border-left 3px amber)
      └─ footer   좌: .arc / 우: .stamp  (플레이북과 동일)
```

### 3.5 컴포넌트 규칙

- `.cmd-badge` — 명령어/키워드. 배경 `--cNbg`, 글자 `--cN`, 모노. 길면 `.long` 클래스(13.5px).
- `.tag` — 영문 2~3단어 요약 (예: `Plan first`, `Quality gate`). 테두리·글자 `--cN`.
- `.kv` 라벨명 — 카드 성격에 맞게: 사용 시점 / 주의 / 연계 / 진입 방법 / 트레이드오프 등.
- `.example` — 모든 카드 통일. `.ex-body` 내 색상 클래스: `.p`(프롬프트 기호 teal) `.c`(teal 강조) `.m`(회색 주석) `.y`(노랑 강조) `.key`(키캡 — 단축키가 주 진입점인 카드용).
- `.minitag` (전체판) — `EXP`/`WIN`/`DEP` 소형 라벨.
- 반응형: `@media (max-width:880px)` — hero 세로 적층, `.grid`·`.sumrow`·`.panels` 1열, h1 축소.

---

## 4. 콘텐츠 컨벤션

- 전부 한국어. **명령어·플래그·영문 고유명사만 원문**.
- 플레이북 한 편 = **하나의 서사 아크**로 묶이는 6카드. 산만한 6개 나열이 아니라 "단계 → 단계"로 읽혀야 함 (설정→계획→검증→정리 식).
- footer 스탬프 형식: `YYYY년 M월 D일 기준 · vX.X.X` + 버전 의존성 캐비엇 한 줄.
- 사실 검증 원칙 — 작업 시작 전 반드시 웹 검색 교차 확인:
  1. **1순위 출처**: OpenAI 공식 문서(`developers.openai.com/codex`), GitHub `openai/codex`, 공식 체인지로그.
  2. **2순위**: 공식 블로그. **3순위**: 최근 가이드. 포럼·추측성 글은 배제.
  3. 자료 간 불일치 항목은 단언하지 말고 라벨 분리 또는 "버전 의존 — 공식 docs 확인" 표기.
  4. 사실과 추론을 구분. 폐기 명령어는 본문에서 빼고 캐비엇으로만 언급.

---

## 5. 검증 상태 & 주의점

### 5.1 버전 기준

- 작업 시점: **2026년 5월 14일**. 스탬프: **v0.130.x 계열**.
- 근거: Codex CLI v0.130은 2026-05-08자(공식 changelog 기능셋 일치). 형제 npm 패키지 `@openai/codex-sdk`·`codex-responses-api-proxy`가 0.130.0. CLI 릴리스 태그를 직접 핀하지는 못해 `.x 계열` + 캐비엇으로 처리.
- **Codex CLI는 거의 매일 패치된다** — 재작업·확장 시 반드시 버전·명령어를 재검증할 것.

### 5.2 라벨 분리한 항목

- **experimental (EXP)**: `/goal`(`features.goals` 필요), `/ps`(`unified_exec` 관련). Codex Cloud·code mode도 공식상 experimental/개발 중.
- **Windows 전용 (WIN)**: `/sandbox-add-read-dir` (네이티브 PowerShell 실행 시만).
- **deprecated (DEP)**: 승인 모드 `on-failure`, 편의 플래그 `--full-auto`. 본문에서 사용 권장하지 않음.

### 5.3 버전 의존 / 공식 문서 미수록 (전체판 하단 스트립으로 분리)

- `/vim` — TUI 모달 Vim 편집. 3자 자료(치트시트)에만 존재, 공식 슬래시 문서 미수록.
- `/hooks` — TUI 훅 브라우저. 3자 자료상 v0.129 추가 보고, 공식 슬래시 문서 미수록.
- → **추적 필요**: 이 둘이 공식 슬래시 문서에 등재되면 전체판 패널 본문으로 승격.

### 5.4 의도적으로 깊게 다루지 않은 영역

- **Hooks 설정 문법**: 정식(stable) 사실과 이벤트 종류(SessionStart·PreToolUse·PostToolUse·PermissionRequest·UserPromptSubmit·Stop), `[features] codex_hooks = true` 게이팅까지만 확인. `hooks.json`/inline `[hooks]` 상세 스키마는 미수록 — 별도 편이 필요하면 공식 Hooks docs 재검증.
- **Subagents/MultiAgentV2**: `/agent`와 개념 수준만. `[agents]` config 상세는 미수록.

---

## 6. 잔여 작업 / 확장 아이디어

- 시리즈 자체(레퍼런스 2 + 플레이북 5 = 7파일)는 **완결**.
- **정기 재검증**: Codex 주간 업데이트 반영 — 신규 슬래시 명령어, 서브커맨드, deprecated 전환.
- **확장 후보 (플레이북)**: Hooks 심화 1편, Subagents/멀티에이전트 1편, Codex Cloud·GitHub 통합 1편.
- **다른 도구 편으로 확장**: 동일 디자인 규격으로 Cursor / Gemini CLI / Claude Code 편 — 명칭과 출처만 교체해 재사용 가능.

---

## 7. 새 세션에서 이어가는 절차

1. **검색 우선** — Codex CLI 현황(슬래시 명령어·서브커맨드·플래그)을 공식 문서로 재확인. 학습 데이터로 단언 금지.
2. **구성안 합의** — 새 편은 6카드 구성안(표: `명령어/키워드 · 영문 태그 · 카드 제목 · 라벨 3행`)을 먼저 제시해 확정받기.
3. **디자인 일관성** — 기존 HTML 1개를 복사 → 내용만 교체. **CSS는 절대 변경하지 않는다.**
4. **편별 검증 보고** — 완성 시 그 편에서 검증한 핵심 사실과 출처를 요약 보고.
5. **출력** — `/mnt/user-data/outputs/`에 단일 HTML로 저장 후 사용자에게 제시.

---

*최종 갱신: 2026년 5월 14일 · Codex CLI v0.130.x 계열 기준*
