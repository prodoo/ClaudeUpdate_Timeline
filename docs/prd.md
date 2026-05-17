# PRD — Claude · Codex 타임라인 (2-page)

| 항목 | 값 |
|---|---|
| **상태** | Live (2026-05-17 마지막 갱신, multi-page) |
| **배포** | https://prodoo.github.io/ClaudeUpdate_Timeline/ (Claude) + `/codex.html` (Codex) |
| **저장소** | https://github.com/prodoo/ClaudeUpdate_Timeline |
| **마지막 갱신** | 2026-05-17 (5차 작업, Codex 페이지 추가) |

## 1. What — 한 문장 정의

같은 저장소 안에 **두 개의 평행 타임라인**:
- `index.html` — **Claude 2026** (2026-01-01 ~ 2026-05-14, 134일, Anthropic 공식 업데이트 **224건** × 8 lane)
- `codex.html` — **ChatGPT 2025–26** (2025-04-16 ~ 2026-05-17, 397일, OpenAI 코딩 생태계 공식 업데이트 **131건** × 9 lane). ADR-008 리브랜드 — Codex가 메인 thread이면서 GPT 본체·Realtime·Research·Community까지 포함.

두 페이지는 헤더 토글로 한 클릭 전환. 디자인·인터랙션·검증 정책 공유, 데이터·컬러·시간 범위·다크 모드 상태는 독립.

## 2. Why — 문제 정의

Anthropic의 업데이트가 **8개 서로 다른 출처**에 흩어져 있다:

- Claude Code: GitHub CHANGELOG
- Claude Apps: support.claude.com 릴리스 노트
- API Platform: platform.claude.com/docs/en/release-notes/api
- Engineering 블로그: anthropic.com/engineering
- Frontier Red Team: red.anthropic.com
- Research 블로그: anthropic.com/research + alignment.anthropic.com
- Corporate 뉴스: anthropic.com/news
- Stealth(유출 분석): venturebeat / alex000kim / wavespeed 등

각 출처가 자체 디자인·시간 단위를 가져 **한눈에 비교할 수 없다.** "PowerShell preview는 언제 나왔고 그때 Research는 무엇을 발표했나?" 같은 질문에 8개 페이지를 오가야 답을 얻는다.

**의도된 결과**: 모든 업데이트가 같은 가로축·같은 색 체계로 배치된 단일 뷰. 호버 → 출처 글 직링크. zoom으로 dense 구간 분해. 검색·필터로 패턴 식별.

## 3. Audience

| 사용자 | Use case |
|---|---|
| Claude 개발자 (CLI·API 사용) | 새 버전 변경사항 추적, 특정 기능이 언제 추가됐는지 찾기 |
| Anthropic 관찰자 (제품·정책) | 4개월 단위로 회사 동향 일별 파악, 데모용 |
| 사용자 본인 | 자신이 관심 있는 카테고리만 보는 personal dashboard |

## 4. Scope

### In
- 2026-01-01 ~ 2026-05-14 범위 8개 카테고리 시각화
- 검증된 출처(공식 페이지 또는 명시된 커뮤니티 분석)만 수록
- 호버 툴팁 + 출처 직링크 (anchor·slug 수준)
- 의미론적 줌(importance threshold) + 시간축 줌(1×~8×)
- 검색 (title + summary + version + source 부분일치)
- 다크 모드 (localStorage 영속)
- 4개 뷰 (타임라인 / 월별 / Top / 테마)
- 더블클릭으로 열리는 zero-build, 모바일 readable mode (lane 수직 누적)

### Out
- 실시간 자동 fetch (수동 갱신 워크플로우만)
- 알림·이메일 구독
- RSS / API 출력
- 영문판 (한국어 전용 — 사용자 본인 용도)
- Anthropic 외 다른 AI 회사

## 5. Functional Requirements

| FR-# | 요구사항 |
|---|---|
| FR-01 | 헤더에 카운터 3개 표시 (전체 / 표시 중 / 기간) + 다크 토글 |
| FR-02 | 4개 뷰 탭 (Timeline / Monthly / Top / Theme) 라우팅 |
| FR-03 | 사이드바: 검색 입력, 의미론적 줌(1-5 슬라이더), 시간축 줌(1/2/4/8 버튼), 소스 체크박스 8개 |
| FR-04 | 타임라인 SVG: 8 lane × 가로 시간축, 월 라벨, TODAY 마커 |
| FR-05 | 버블 시각 단서: 컬러=출처, 반경=importance, 점선=Preview, 굵은=major(imp 5), 별=Stealth |
| FR-06 | 같은 lane·근접 X 좌표 버블은 vertical jitter로 분리 |
| FR-07 | 라벨: zoom-aware 임계값(1×/2×=imp 5, 4×=imp 4+, 8×=imp 3+) + X 거리 충돌 회피 + 20자 컷 |
| FR-08 | 호버 툴팁: 제목 / 날짜·소스·버전 / 단계·imp / 요약 4행. pointer-events: auto + 180ms hide delay |
| FR-09 | 버블·툴팁 클릭 시 출처 URL 새 탭 (`window.open(_, "_blank", "noopener")`) |
| FR-10 | JUMP 버튼: Jan/Feb/Mar/Apr/May/TODAY로 가로 스크롤 |

## 6. Data Model

각 이벤트:
```js
{
  date: "YYYY-MM-DD",      // 정렬·x축 매핑
  title: "짧은 제목",
  version: "v2.1.84" | "",
  importance: 1-5,         // 버블 반경 = 2 + imp × 1.6
  stage: "GA" | "Preview" | "Beta" | "Hidden" | "Blog" | "Paper" | "News" | "Press" | "Report",
  summary: "1-2문장 한국어",
  url: "정확한 출처 URL (anchor·slug 포함)"
}
// source는 파일명으로 자동 주입
```

### 출처별 카운트 (2026-05-14 기준)

| 카테고리 | 건수 | 출처 | URL 정확도 |
|---|---|---|---|
| Claude Code | 106 | GitHub CHANGELOG + code.claude.com whats-new (Week 18~19) | 100% (버전 anchor 또는 Week 다이제스트 URL) |
| Claude Apps | 24 | support.claude.com | 100% |
| API Platform | 28 | platform.claude.com | 100% (`#month-day-2026` anchor) |
| Engineering | 9 | anthropic.com/engineering | 100% (slug) |
| Red Team | 6 | red.anthropic.com | 100% |
| Research | 27 | anthropic.com/research + alignment.anthropic.com | 100% (slug) |
| Corporate | 15 | anthropic.com/news | 100% (slug) |
| Stealth | 9 | venturebeat / alex000kim / wavespeed | 100% (외부 글 URL) |
| **합계** | **224** | | **100%** |

## 7. Non-functional

| 항목 | 목표 |
|---|---|
| 빌드 | 없음 (zero-build, `<script src>` 만으로 로드) |
| 의존성 | 없음 (vanilla CSS/JS/SVG) |
| 첫 페인트 | < 1초 (로컬 파일) |
| 인터랙션 응답 | < 100ms (검색·줌·체크박스) |
| 모바일 | 1080px 이하 readable mode (lane 수직 누적) |
| 다크 모드 | localStorage 영속, `data-theme` CSS 변수 즉시 전환 |
| 접근성 | SVG `<text>` 라벨, 키보드 탭 가능한 버튼, role="tooltip" |
| 호환성 | Chrome / Edge / Safari / Firefox 최신 |

## 8. Architecture (multi-page)

```
저장소 root
├── index.html      ← Claude 2026 (단일 페이지, SVG + 인라인 CSS/JS)
│      │
│      ├─ <nav class="page-toggle"> [Claude 2026 *active*] [Codex 2025–26]
│      ├─ <script src="data/cc.js">      ← EVENTS_BY_SOURCE["Claude Code"]
│      ├─ <script src="data/apps.js">    ← ["Claude Apps"]
│      ├─ ... (8개)
│      └─ <script>render</script>
│
└── codex.html      ← ChatGPT 2025–26 (9 lane, ADR-008 리브랜드)
       │
       ├─ <nav class="page-toggle"> [Claude 2026] [ChatGPT 2025–26 *active*]
       ├─ <script src="data/codex/cli.js">         ← EVENTS_BY_SOURCE["Codex CLI"]
       ├─ <script src="data/codex/app.js">         ← ["Codex App"]
       ├─ <script src="data/codex/models.js">      ← ["Codex Models"]
       ├─ <script src="data/codex/gpt-models.js">  ← ["GPT Models"]
       ├─ <script src="data/codex/platform.js">    ← ["Platform"]
       ├─ <script src="data/codex/research.js">    ← ["Research"]
       ├─ <script src="data/codex/blog.js">        ← ["Dev Blog"]
       ├─ <script src="data/codex/corp.js">        ← ["Corporate"]
       ├─ <script src="data/codex/community.js">   ← ["Community"]
       └─ <script>render</script>
```

**공유**: 디자인 시스템(SVG 렌더링·툴팁·zoom·검색·다크 모드), 4뷰 탭, 사이드바, 라벨 전략(ADR-006), 검증 정책(ADR-004/005), 헤더 토글 markup.

**독립**: 데이터 파일·SOURCES 키·컬러 팔레트·시간 범위·MONTH_LBL·다크 모드 localStorage 키(`c2026-dark` vs `codex2026-dark`).

데이터·코드 분리(ADR-002)로 다음을 보장:
- 카테고리별 git diff 명료
- 데이터 추가 시 HTML 수정 불필요
- 새 카테고리 추가 = 새 `data/X.js` (또는 `data/codex/X.js`) + SOURCES에 키 + `<script src>` 1개

**Multi-page 분리 결정 이력**: [ADR-007](./decisions.md#adr-007--multi-page-구조-claude--codex)
**ChatGPT 리브랜드 + 9 lane 결정 이력**: [ADR-008](./decisions.md#adr-008--codex--chatgpt-페이지-리브랜드--9-lane--밀도-보강)

## 9. Verification Policy

1. **추정 거부**: WebFetch로 출처 페이지 직접 확인. `(추정)` 라벨 사용 금지. 단, Stealth 카테고리의 일부는 본질적으로 비공식이라 `(커뮤니티 추정)` 표시 허용.
2. **URL 정확성**: anchor 또는 개별 글 slug까지 매칭. 카테고리 일반 페이지 URL은 사용 금지.
3. **누락 우선**: 검증 불가 항목은 빼는 것이 낫다.

세부 의사결정 이력은 [decisions.md](./decisions.md) 참조.

## 10. Roadmap

### 완료
| 차수 | 작업 | 결과 |
|---|---|---|
| 1차 | 초기 빌드 (이미지 모방, 200건) | 단일 HTML, 8 lane |
| 2차 | 2026-04-27 ~ 05-14 신규 14건 반영 | 214건, 134일 |
| 3차 | 데이터·코드 분리 + GitHub Public + URL 100% 검증 | data/*.js 8개, Pages 배포 |
| 4차 | 라벨 zoom-aware + 충돌 회피 + 20자 컷, docs 폴더 | 시각적 가독성 개선 |

### 향후 (Out of Scope이지만 검토 가능)
- 자동 URL 헬스체크 GitHub Action (주 1회 HEAD 요청)
- 신규 카테고리 추가 가이드 (CONTRIBUTING.md)
- 영문판 (사용자 요청 시)
- 다른 AI 회사 비교 모드 (별도 프로젝트로 분리 권장)
