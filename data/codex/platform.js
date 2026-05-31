/* Platform — developers.openai.com/codex/changelog + developers.openai.com/api/docs/changelog
 * Sources:
 *   - https://developers.openai.com/codex/changelog (#month-YYYY-MM anchor — 2026-04~ 만 가시)
 *   - https://developers.openai.com/api/docs/changelog (Codex 관련 API release notes, 2025-04~)
 * Verified: 2026-05-31
 * Note: codex/changelog는 month-level anchor만 — ADR-007 예외.
 *       api/docs/changelog 의 Codex 관련 entry는 별도 게시일 보유 (더 정밀).
 */
(window.EVENTS_BY_SOURCE = window.EVENTS_BY_SOURCE || {})["Platform"] = [
{date:"2025-05-15",title:"API: codex-mini-latest 출시",version:"codex-mini-latest",importance:4,stage:"GA",summary:"Codex CLI와 함께 사용하도록 최적화된 codex-mini-latest 모델이 OpenAI API에 출시.",url:"https://developers.openai.com/api/docs/changelog"},
{date:"2025-09-23",title:"API: gpt-5-codex 출시",version:"gpt-5-codex",importance:4,stage:"GA",summary:"Codex CLI 용으로 빌드·최적화된 gpt-5-codex 특수 목적 모델이 API에 정식 공개.",url:"https://developers.openai.com/api/docs/changelog"},
{date:"2025-11-13",title:"API: gpt-5.1-codex + gpt-5.1-codex-mini",version:"gpt-5.1-codex",importance:4,stage:"GA",summary:"Responses API에 gpt-5.1-codex와 gpt-5.1-codex-mini 출시 — 에이전틱 코딩 작업 최적화.",url:"https://developers.openai.com/api/docs/changelog"},
{date:"2026-01-14",title:"API: gpt-5.2-codex (Responses API)",version:"gpt-5.2-codex",importance:4,stage:"GA",summary:"GPT-5.2 기반 에이전틱 코딩 최적화 모델이 Responses API에 정식 출시.",url:"https://developers.openai.com/api/docs/changelog"},
{date:"2026-02-24",title:"API: gpt-5.3-codex (Responses API)",version:"gpt-5.3-codex",importance:4,stage:"GA",summary:"GPT-5.3-Codex가 Responses API에 정식 출시.",url:"https://developers.openai.com/api/docs/changelog"},
{date:"2026-04-30",title:"CLI 0.128.0 — persisted goal workflows",version:"v0.128.0",importance:3,stage:"GA",summary:"persisted goal workflows, permission profiles, plugin marketplace 설치, 세션 import.",url:"https://developers.openai.com/codex/changelog#month-2026-04"},
{date:"2026-05-05",title:"Enterprise: Codex access tokens",version:"",importance:3,stage:"GA",summary:"ChatGPT Enterprise 워크스페이스 멤버가 비대화형·trusted 자동화 워크플로용 Codex access token을 생성 가능.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-06",title:"Enterprise governance guide updated",version:"",importance:2,stage:"GA",summary:"Analytics 대시보드 차트 + 데이터 export 옵션 상세 가이드 추가.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-07",title:"Codex Chrome extension launched",version:"",importance:4,stage:"GA",summary:"브라우저 탭별 백그라운드 병렬 작업 가능. 사용자 접근 권한 제어.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-07",title:"CLI 0.129.0 — Vim mode, hooks",version:"v0.129.0",importance:3,stage:"GA",summary:"Vim 에디터 모드, 워크플로 개선, 플러그인 관리 강화, hooks 기능.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-08",title:"CLI 0.130.0 — plugin sharing, remote control",version:"v0.130.0",importance:3,stage:"GA",summary:"플러그인 공유, remote control 커맨드, app-server 페이지네이션, 다수 버그픽스.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-11",title:"Auto-review documentation expanded",version:"",importance:2,stage:"GA",summary:"reviewer 라이프사이클, 트리거 조건, 실패 동작, 설정 옵션을 다루는 Auto-review 문서 확장.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-14",title:"Work with Codex from anywhere",version:"",importance:4,stage:"GA",summary:"ChatGPT 모바일 앱에서 Mac에 실행 중인 Codex 앱으로 원격 접속.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-18",title:"Codex CLI 0.131.0",version:"v0.131.0",importance:3,stage:"GA",summary:"TUI에 서비스 등급 명령, 혼합 토큰 사용량 표시, 권한·승인 모드 표시기가 추가되었다. @ 멘션이 파일·디렉토리·플러그인·스킬을 단일 선택기에서 검색하고, Python SDK가 openai-codex로 이동했으며 codex doctor 진단 명령이 도입되었다.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-20",title:"Codex CLI 0.132.0",version:"v0.132.0",importance:3,stage:"GA",summary:"Python SDK에 API 키 로그인, ChatGPT 브라우저·기기 코드 흐름을 포함한 일급 인증이 추가되었다. 텍스트 전용 워크플로의 turn API가 단순화되어 일반 문자열 입력을 받고, codex exec resume이 세션 맥락을 유지하면서 --output-schema로 구조화된 JSON 출력을 받을 수 있다.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-21",title:"앱샷, 목표 모드 등",version:"",importance:4,stage:"GA",summary:"macOS에서 앱샷(Appshots)이 제공되어 양쪽 Command 키를 눌러 전면 앱 창의 스크린샷과 텍스트를 Codex로 전송할 수 있다. 목표 모드(goal mode)가 실험 기능에서 앱·IDE 확장·CLI의 정식 기능으로 전환되었고, Mac 잠금 이후의 원격 컴퓨터 사용과 ChatGPT 비즈니스용 마켓플레이스 플러그인 공유가 추가되었다.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-21",title:"Codex CLI 0.133.0",version:"v0.133.0",importance:3,stage:"GA",summary:"목표(goals)가 기본 활성화되어 활성 턴 전반의 진행 상황을 전용 저장소에 추적한다. codex remote-control 명령이 준비 상태 보고와 데몬형 제어를 갖춘 전경 프로세스로 동작하고, 권한 프로필에 목록 API·상속·관리형 requirements.toml 지원이 추가되었다.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-26",title:"Codex CLI 0.134.0",version:"v0.134.0",importance:3,stage:"GA",summary:"대소문자를 구분하지 않는 로컬 대화 기록 검색과 미리보기 결과가 추가되었다. --profile 플래그가 CLI·샌드박스 전반의 기본 프로필 선택기가 되었으며, MCP 설정에 서버별 환경 지정과 HTTP 서버용 OAuth 옵션이 도입되고 readOnlyHint로 표시된 읽기 전용 MCP 도구의 동시 실행이 가능해졌다.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-28",title:"Codex CLI 0.135.0",version:"v0.135.0",importance:3,stage:"GA",summary:"codex doctor가 환경·Git·터미널·앱 서버·스레드 진단을 제공하고 /status 명령이 원격 연결 정보와 서버 버전을 표시한다. Vim 모드에 텍스트 오브젝트 편집과 구성 가능한 인터럽트 바인딩이 추가되었고, 명명된 권한 프로필과 마크다운 표·목록 렌더링이 개선되었다.",url:"https://developers.openai.com/codex/changelog#month-2026-05"},
{date:"2026-05-29",title:"Windows에서 컴퓨터 사용 및 모바일 접근",version:"",importance:4,stage:"GA",summary:"Windows에서 컴퓨터 사용(Computer Use)이 지원되어 Codex가 전면 데스크톱 앱을 보고 클릭·입력하며 작업할 수 있게 되었다. 원격 제어가 Windows 기기로 확대되어 ChatGPT 모바일이나 Mac에서 작업을 시작하고 진행 상황을 확인할 수 있으며, 프로필 영역에서 사용량과 토큰 활동을 표시한다.",url:"https://developers.openai.com/codex/changelog#month-2026-05"}
];
