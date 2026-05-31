# Claude Code 노하우 페이지 시리즈 — 작업 인수인계 문서

> 이 문서는 프로젝트 루트의 `CLAUDE.md`로 그대로 사용 가능합니다.
> Claude Code가 이 파일을 읽고 아래 디자인 규격·컨벤션을 따라 작업을 이어갑니다.

---

## 0. 이 프로젝트가 무엇인가

Codex CLI의 치트시트 이미지 2종을 디자인 레퍼런스로 삼아, **Claude Code 사용 노하우를
같은 디자인 언어의 단일 파일 HTML 페이지로 시리즈화**하는 프로젝트. 전부 한국어, 정적 HTML
(빌드 도구·프레임워크 없음, CDN 폰트만 사용).

산출물은 두 계열:
- **레퍼런스 계열** — 명령어를 빠짐없이 훑는 나열형 (밀집 그리드)
- **플레이북 계열** — 명령어를 적게 골라 "언제/주의/예시"까지 깊게 파는 심화 코칭형 (6카드)

레퍼런스 이미지 출처: 사용자가 업로드한 Codex CLI cheat sheet(밀집 그리드형),
Codex skill cheatsheet(심화 카드형). 후자가 플레이북 계열의 골격.

---

## 1. 파일 인벤토리 (9개, 모두 단일 HTML)

### 레퍼런스 계열
| 파일 | 내용 | 구조 |
|---|---|---|
| `claude-code-cheat-sheet.html` | 핵심 명령어 총정리 | 5패널 (A 실행·세션 / B 권한 / C 작업제어 / D UI단축키 / CI GitHub) |
| `claude-code-cheat-sheet-full.html` | 전체 명령어 총정리 | 8패널 A~H + CLI 스트립, 공개 슬래시 명령어 전수 + 내부/유출 명령어 별도 박스 |

### 플레이북 계열 (모두 동일 6카드 포맷)
| 파일 | 주제 | 6카드 아크 |
|---|---|---|
| `claude-code-workflow-playbook.html` | 라이프사이클 | 설정→계획→조율→검증→정리→회복 (CLAUDE.md·/plan·/effort·/review·/compact·/rewind) |
| `claude-code-orchestration-playbook.html` | A. 멀티 에이전트 오케스트레이션 | 정의→층위→병렬→격리→지휘→통제 (/agents·subagent vs Teams·parallel·--worktree·claude agents·/goal) |
| `claude-code-automation-hooks-playbook.html` | C. 자동화 & Hooks | 구조→이벤트→차단→정리→제어→안전 (settings.json·lifecycle events·PreToolUse·PostToolUse·4 handlers·safe by design) |
| `claude-code-extension-playbook.html` | D. 확장 Skills·Plugins·MCP | 구분→제작→호출→배포→연결→안전 (4 mechanisms·SKILL.md·/skills·/plugin·/mcp·extension safety) |
| `claude-code-context-engineering-playbook.html` | B. 컨텍스트 엔지니어링 | 원리→구성→계층→분할→격리→보존 (context rot·/context·CLAUDE.md·.claude/rules/·subagent+/btw·/compact) |
| `claude-code-headless-cicd-playbook.html` | E. 헤드리스 & CI/CD | 기본→재현성→출력→경계→비용→통합 (claude -p·--bare·--output-format·--allowedTools·--max-turns·claude-code-action) |
| `claude-code-permission-autonomy-playbook.html` | F. 권한 & 자율성 | 기본→모드→규칙→순서→격리→자율성 (least privilege·permission modes·allow/deny/ask·eval order·/sandbox·auto vs bypass) |

### 잔여 작업
- **G. 원격 & 멀티 디바이스** — 미제작. `/rc`·`/schedule`·`/teleport`·`/remote-env`·자리 비움 요약 등. 만들 경우 플레이북 6카드 포맷 그대로.

---

## 2. 공통 디자인 규격 (플레이북 계열)

신규 플레이북을 만들거나 기존 것을 수정할 때 **반드시** 이 토큰·구조를 따른다.
기존 플레이북 HTML 파일 하나를 복사해 내용만 교체하는 방식이 가장 안전하다.

### 2.1 폰트 (CDN, `<head>`에 그대로)
- 본문: **Pretendard** — `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css`
- 모노: **JetBrains Mono** (500/700) — Google Fonts
- CSS 변수: `--mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;`

### 2.2 색상 토큰 (`:root`)
```
중립
--navy:#1c2433   --navy2:#283448   --ink:#222831
--gray:#5f6b7a   --soft-gray:#8b95a3
--line:#e7e9ee   --bg:#ffffff      --soft:#f4f5f8
페이지 배경:#dfe3ea

6단계 액센트 (카드 1~6 순서대로 고정)
--c1 teal   #2bb3a3 / --c1bg #e4f5f3
--c2 blue   #3f6fd1 / --c2bg #e7eefb
--c3 indigo #5b6ee0 / --c3bg #e9ebfc
--c4 amber  #e09a2d / --c4bg #fbf0db
--c5 green  #2f9e6e / --c5bg #e3f4ec
--c6c red   #e0594d / --c6bg #fbe7e4   (변수명이 --c6c 인 점 주의)
```
요약 카드 3장은 각각 c1·c3·c5 색을 구간 대표색으로 사용.

### 2.3 레이아웃 골격
```
.sheet (max-width:1180px, 흰 배경, radius 6px, 그림자)
├─ .hero           다크(navy) 배경. 좌: eyebrow + h1 / 우: .summary-box(폭 392px)
│   └─ .summary-box  navy2 배경. .thesis(주제문 1줄) + .mini(명령어 6개 미니 목록)
└─ .body (padding:24px 26px 30px)
   ├─ .sumrow      요약 카드 3장 (grid 3열, 카드 상단 3px 컬러 보더)
   └─ .grid        상세 카드 6장 (grid 2열)
       └─ .card
          ├─ .card-top   .cmd-badge(컬러 배지) + .tag(우측 pill)
          ├─ h2          카드 제목 (굵게)
          ├─ .lead       설명 단락
          ├─ .rows       .kv 3행 (라벨-값) — 항목명은 카드별로 다름
          └─ .example    다크 박스. .ex-lbl("실전 예시") + .ex-body
   footer            좌: 아크 요약 / 우: "2026년 X월 X일 기준 · vX.X.X · ..." 캐비엇
```
반응형: `@media (max-width:880px)` 에서 hero 세로 적층, grid·sumrow 1열.

### 2.4 카드 내부 컴포넌트 규칙
- `.cmd-badge` — 명령어/키워드. 배경 `--cNbg`, 글자 `--cN`, 모노폰트. 길이에 따라 폰트 크기만 13.5~17px 사이 조정.
- `.tag` — 영문 2~3단어 요약 라벨 (예: `Plan first`, `Quality gate`). 테두리·글자 `--cN`.
- `.lead` — 2~3문장. `<b>` 강조, `<code>` 인라인 명령어.
- `.kv` — 라벨 폭 74~84px 고정. 라벨명은 카드 성격에 맞게 (사용 시점 / 주의 / 연계 / 진입 방법 등). 값에 `<b>`·`<code>` 사용.
- `.example` — 다크 박스. 모든 카드에 통일 적용.
  - 슬래시 명령어 카드: 실제 명령어 예시
  - 단축키가 주 진입점인 카드: `.key` 클래스로 키캡 표현 (예: `Shift`+`Tab`, `Esc` `Esc`)
  - `.ex-body` 내 색상: `.c`(teal 강조), `.m`(회색 주석), `.y`(노랑 강조), `.key`(키캡)

---

## 3. 콘텐츠 컨벤션

1. **언어** — 전부 한국어. 명령어·플래그·영문 고유명사만 원문.
2. **날짜·버전 스탬프** — footer에 `2026년 5월 14일 기준 · v2.1.141` 형식. 갱신 시 두 값 모두 업데이트.
3. **사실/추론 구분** — 카드 본문은 검증된 사실만. 가용 플랜처럼 자료 간 불일치가 있는 항목은
   단언하지 말고 "확장 중 — 공식 docs 확인" 식으로 표기. footer에 버전 의존성 캐비엇 필수.
4. **출처 검증** — 신규 카드 제작 전 반드시 웹 검색으로 교차 확인. 1순위 출처는
   `code.claude.com/docs` (공식), 2순위 공식 블로그·CHANGELOG, 3순위 최근 가이드.
   Claude Code는 거의 주간 단위 릴리스이므로 "전수/최신"은 단언 금지, `/help`·공식 docs 안내.
5. **폐기 명령어 제외** — `/tag`·`/vim`(슬래시) 등 제거된 항목은 싣지 않음.
6. **레퍼런스 계열의 신뢰도 라벨** — 공개 빌드 미확인 명령어는 "내부·유출 기반" 별도 박스로 분리.

---

## 4. 플레이북 한 편을 새로 만드는 절차

1. **테마 확정** — 하나의 서사로 6카드가 묶이는가? (예: "설정→...→회복" 같은 아크)
2. **6카드 구성안 작성** — 카드별 `cmd-badge / tag / 제목 / kv 3행 라벨`을 표로 먼저 확정.
3. **사실 검증** — 카드별 핵심 주장을 웹 검색으로 교차 확인.
4. **HTML 생성** — 기존 플레이북 파일 복사 → hero·summary·6카드·footer 내용 교체.
   CSS는 건드리지 않는다 (색상 토큰·구조 동일 유지).
5. **검수** — 6단계 색상 순서(c1~c6), footer 날짜·버전, 반응형 깨짐 여부.

> 구성안은 만들기 전에 사용자와 상의해 확정한다 (이 프로젝트의 진행 방식).

---

## 5. Claude Code에서 이어가기 위한 준비

1. 컨테이너 산출물은 세션 종료 시 사라지므로, **9개 HTML + 이 `CLAUDE.md`를 모두
   다운로드**해 로컬 프로젝트 폴더에 모은다.
2. 폴더 구조 권장:
   ```
   claude-code-playbooks/
   ├─ CLAUDE.md                 (이 문서)
   ├─ reference/
   │   ├─ claude-code-cheat-sheet.html
   │   └─ claude-code-cheat-sheet-full.html
   └─ playbooks/
       ├─ claude-code-workflow-playbook.html
       ├─ claude-code-orchestration-playbook.html
       ├─ claude-code-automation-hooks-playbook.html
       ├─ claude-code-extension-playbook.html
       ├─ claude-code-context-engineering-playbook.html
       ├─ claude-code-headless-cicd-playbook.html
       └─ claude-code-permission-autonomy-playbook.html
   ```
   (폴더를 나눴다면 이 문서 1·2장의 경로도 함께 수정할 것)
3. 해당 폴더에서 `claude` 실행 → 이 `CLAUDE.md`가 자동 로드됨.
4. 파일이 단일 HTML이라 브라우저로 바로 열어 확인 가능. 별도 서버·빌드 불필요.

### 이어서 할 만한 작업
- **G 플레이북 신규 제작** (원격 & 멀티 디바이스) — 4장 절차대로.
- **인덱스 페이지** — 9개 카드셋을 한눈에 보여주는 허브 HTML (동일 디자인 토큰 재사용).
- **버전 갱신** — Claude Code 릴리스에 맞춰 footer 스탬프 + 변경된 명령어 동작 반영.
- **레퍼런스 계열 동기화** — 신규 명령어 추가 시 `cheat-sheet-full.html` 패널 갱신.
- **포맷 변형** — PDF/이미지 내보내기, 다크 모드 토글 등 (요청 시).

---

## 6. 알려진 주의점

- `--c6c` — 6번 카드 색상 변수명만 `c6`이 아니라 `c6c`. 복사·수정 시 혼동 주의.
- 단축키 카드의 `.example`는 코드가 아니라 키 입력 흐름을 넣는다 (`.key` 클래스 사용).
- auto 모드 가용 플랜은 자료별 상이 — 단언하지 말 것.
- "전체 명령어" 시트의 내부/유출 명령어는 표준 공개 빌드에 없을 수 있음 — 라벨 유지.
- 모든 수치·동작은 v2.1.158 기준(2026-05-31 캐치업). 버전이 오르면 재검증 필요. (드로어 개별 `version` 필드는 명령어별 도입·검증 버전으로, 매뉴얼 스탬프와 별개)
