/* Codex CLI — github.com/openai/codex releases
 * Sources: https://github.com/openai/codex/releases/tag/rust-vX.Y.Z (stable releases only)
 * Verified: 2026-05-17 (각 항목 GitHub API로 tag_name + published_at 확인)
 * Note: alpha/pre-release는 제외. 의미 있는 마이너 버전 위주.
 */
(window.EVENTS_BY_SOURCE = window.EVENTS_BY_SOURCE || {})["Codex CLI"] = [
{date:"2025-04-16",title:"Codex CLI 초기 출시",version:"",importance:5,stage:"GA",summary:"OpenAI가 터미널용 코딩 에이전트 Codex CLI 오픈소스 공개. Rust 기반, Apache-2.0 라이선스. codex-mini-latest API와 함께 출시.",url:"https://github.com/openai/codex"},
{date:"2025-07-10",title:"v0.5.0: reasoning summaries config",version:"v0.5.0",importance:3,stage:"GA",summary:"model_supports_reasoning_summaries 설정 추가. Rust 1.88 지원. shell completion 이름을 codex-cli → codex로 수정.",url:"https://github.com/openai/codex/releases/tag/rust-v0.5.0"},
{date:"2025-07-24",title:"v0.10.0: more trusted-by-default commands",version:"v0.10.0",importance:3,stage:"GA",summary:"기본으로 신뢰되는 커맨드 확대, .jsonl 로그에 Git state 기록, TUI 헤더 일관성 수정.",url:"https://github.com/openai/codex/releases/tag/rust-v0.10.0"},
{date:"2025-08-09",title:"v0.20.0: Rust CLI as npm default",version:"v0.20.0",importance:4,stage:"GA",summary:"@openai/codex npm 패키지가 Rust CLI를 실행(기존 TypeScript CLI 폴백 제거). Windows 주요 수정.",url:"https://github.com/openai/codex/releases/tag/rust-v0.20.0"},
{date:"2025-08-27",title:"v0.25.0: remove_conversation API, TUI mouse wheel",version:"v0.25.0",importance:3,stage:"GA",summary:"장시간 서버용 remove_conversation API, transcript/diff 뷰 마우스 휠 스크롤, Alt+Ctrl+H 단어 삭제.",url:"https://github.com/openai/codex/releases/tag/rust-v0.25.0"},
{date:"2025-09-05",title:"v0.30.0: breaking — no auto .env loading",version:"v0.30.0",importance:4,stage:"GA",summary:"Breaking: 프로젝트 .env 자동 로딩 중단. rollout policy 도입, 공유 HTTP 클라이언트, OAuth 로그인 취소 시 포트 해제.",url:"https://github.com/openai/codex/releases/tag/rust-v0.30.0"},
{date:"2025-09-15",title:"v0.35.0",version:"v0.35.0",importance:2,stage:"GA",summary:"v0.36.0과 통합 릴리스 (변경사항 함께 게시).",url:"https://github.com/openai/codex/releases/tag/rust-v0.35.0"},
{date:"2025-09-23",title:"v0.40.0: gpt-5-codex as default model",version:"v0.40.0",importance:5,stage:"GA",summary:"기본 모델을 gpt-5-codex로 변경. 220k 토큰 도달 시 autocompaction 자동 트리거. /status에서 usage limit 표시. /review 커맨드(commit/branch/custom) 추가.",url:"https://github.com/openai/codex/releases/tag/rust-v0.40.0"},
{date:"2025-10-25",title:"v0.50.0: /feedback diagnostics",version:"v0.50.0",importance:3,stage:"GA",summary:"진단 개선된 /feedback. 모델이 sandbox 위반 명령에 대해 요약·위험성 평가 제공.",url:"https://github.com/openai/codex/releases/tag/rust-v0.50.0"},
{date:"2025-11-04",title:"v0.55.0: Linux startup fix",version:"v0.55.0",importance:2,stage:"GA",summary:"musl 1.2.5 pin 되돌려 Linux 시작 실패 수정. codex_delegate delta 무시.",url:"https://github.com/openai/codex/releases/tag/rust-v0.55.0"},
{date:"2025-11-19",title:"v0.60.1: gpt-5.1-codex default for API",version:"v0.60.1",importance:4,stage:"GA",summary:"API 사용자 기본 모델을 gpt-5.1-codex로 변경. v0.59.0의 주요 변경사항 포함된 버그픽스 릴리스.",url:"https://github.com/openai/codex/releases/tag/rust-v0.60.1"},
{date:"2025-12-04",title:"v0.65.0: Codex Max default, /resume",version:"v0.65.0",importance:4,stage:"GA",summary:"Codex Max를 기본 모델로. /resume 슬래시 커맨드 + resume 성능 개선. Tooltip/tips UX 보강. async-in-sync TUI panic 수정.",url:"https://github.com/openai/codex/releases/tag/rust-v0.65.0"},
{date:"2025-12-18",title:"v0.75.0: GPT-5.2-Codex 출시 정렬",version:"v0.75.0",importance:3,stage:"GA",summary:"GPT-5.2-Codex 발표일에 맞춰 출시.",url:"https://github.com/openai/codex/releases/tag/rust-v0.75.0"},
{date:"2026-01-09",title:"v0.80.0",version:"v0.80.0",importance:3,stage:"GA",summary:"2026년 첫 메이저 마이너 릴리스.",url:"https://github.com/openai/codex/releases/tag/rust-v0.80.0"},
{date:"2026-01-25",title:"v0.90.0",version:"v0.90.0",importance:3,stage:"GA",summary:"맥OS 데스크톱 앱 출시 직전 안정화.",url:"https://github.com/openai/codex/releases/tag/rust-v0.90.0"},
{date:"2026-02-12",title:"v0.100.0: Codex-Spark 출시 정렬",version:"v0.100.0",importance:4,stage:"GA",summary:"GPT-5.3-Codex-Spark 리서치 프리뷰 발표일 릴리스.",url:"https://github.com/openai/codex/releases/tag/rust-v0.100.0"},
{date:"2026-03-05",title:"v0.110.0: Windows app launch period",version:"v0.110.0",importance:3,stage:"GA",summary:"Windows 데스크톱 앱 정식 출시(3/4) 직후 CLI 안정화.",url:"https://github.com/openai/codex/releases/tag/rust-v0.110.0"},
{date:"2026-03-16",title:"v0.115.0",version:"v0.115.0",importance:3,stage:"GA",summary:"3월 중반 정기 릴리스.",url:"https://github.com/openai/codex/releases/tag/rust-v0.115.0"},
{date:"2026-04-11",title:"v0.120.0",version:"v0.120.0",importance:3,stage:"GA",summary:"'Codex for almost everything' 발표 직전 안정화 릴리스.",url:"https://github.com/openai/codex/releases/tag/rust-v0.120.0"},
{date:"2026-04-30",title:"v0.128.0: persisted goals, permission profiles",version:"v0.128.0",importance:4,stage:"GA",summary:"persisted goal workflows, permission profiles, plugin marketplace 설치, 세션 import 도입.",url:"https://github.com/openai/codex/releases/tag/rust-v0.128.0"},
{date:"2026-05-07",title:"v0.129.0: Vim mode + hooks",version:"v0.129.0",importance:4,stage:"GA",summary:"Vim 에디터 모드, hooks 기능, 워크플로 개선, 플러그인 관리 강화.",url:"https://github.com/openai/codex/releases/tag/rust-v0.129.0"},
{date:"2026-05-08",title:"v0.130.0: plugin sharing, remote control",version:"v0.130.0",importance:4,stage:"GA",summary:"플러그인 공유, remote control 커맨드, app-server 페이지네이션, 다수 버그 수정.",url:"https://github.com/openai/codex/releases/tag/rust-v0.130.0"},
];
