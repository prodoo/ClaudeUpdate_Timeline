/* Models — Codex 전용 모델 출시 (GPT-5-Codex 계열, codex-mini)
 * Sources: openai.com/index/<slug>, system card PDF (cdn.openai.com)
 * Verified: 2026-05-17
 */
(window.EVENTS_BY_SOURCE = window.EVENTS_BY_SOURCE || {})["Models"] = [
{date:"2025-04-16",title:"codex-mini-latest API model",version:"codex-mini",importance:4,stage:"GA",summary:"Codex CLI와 함께 codex-mini-latest API 모델 공개. o-series 계열의 코딩 특화 경량 모델.",url:"https://github.com/openai/codex"},
{date:"2025-09-15",title:"GPT-5-Codex",version:"gpt-5-codex",importance:5,stage:"GA",summary:"Codex 전용으로 GPT-5를 추가 학습한 모델. 풀 프로젝트 빌드, 기능 추가, 디버깅, 대규모 리팩터, 코드 리뷰까지 에이전틱 SW 엔지니어링 최적화.",url:"https://openai.com/index/introducing-upgrades-to-codex/"},
{date:"2025-09-23",title:"GPT-5-Codex API 일반 공개",version:"gpt-5-codex",importance:4,stage:"GA",summary:"API 키 사용자에게 GPT-5-Codex 공개. Codex CLI v0.40.0에서 기본 모델로 채택.",url:"https://github.com/openai/codex/releases/tag/rust-v0.40.0"},
{date:"2025-11-12",title:"GPT-5.1 + GPT-5.1-Codex + Codex-Mini",version:"gpt-5.1-codex",importance:5,stage:"GA",summary:"GPT-5.1 패밀리 5종 출시. gpt-5.1-codex(에이전틱 장기 작업 최적화), gpt-5.1-codex-mini(저비용 변종) 동시 발표.",url:"https://openai.com/index/gpt-5-1-for-developers/"},
{date:"2025-12-04",title:"Codex Max as default",version:"gpt-5.1-codex-max",importance:4,stage:"GA",summary:"Codex CLI v0.65.0에서 Codex Max를 기본 모델로 채택. /resume 슬래시 커맨드 추가.",url:"https://github.com/openai/codex/releases/tag/rust-v0.65.0"},
{date:"2025-12-18",title:"GPT-5.2-Codex",version:"gpt-5.2-codex",importance:5,stage:"GA",summary:"GPT-5.2 기반 에이전틱 코딩 최적화 모델. context compaction으로 장시간 작업 개선, 대규모 리팩터·마이그레이션 성능 강화, Windows 환경 개선, 사이버보안 능력 대폭 향상. SWE-Bench Pro / Terminal-Bench 2.0 SOTA.",url:"https://openai.com/index/introducing-gpt-5-2-codex/"},
{date:"2025-12-18",title:"GPT-5.2-Codex System Card",version:"gpt-5.2-codex",importance:3,stage:"Paper",summary:"GPT-5.2 시스템 카드 부록. Codex 변종의 안전성·평가 결과 문서.",url:"https://openai.com/index/gpt-5-2-codex-system-card/"},
{date:"2026-02-05",title:"GPT-5.3-Codex",version:"gpt-5.3-codex",importance:5,stage:"GA",summary:"가장 강력한 에이전틱 코딩 모델. GPT-5.2-Codex의 코딩 성능 + GPT-5.2의 추론·전문지식을 단일 모델로 통합. 25% 더 빠르고 self-train(bootstrapped).",url:"https://openai.com/index/introducing-gpt-5-3-codex/"},
{date:"2026-02-05",title:"GPT-5.3-Codex System Card",version:"gpt-5.3-codex",importance:3,stage:"Paper",summary:"GPT-5.3-Codex 시스템 카드 (PDF). 평가·안전성 결과.",url:"https://openai.com/index/gpt-5-3-codex-system-card/"},
{date:"2026-02-12",title:"GPT-5.3-Codex-Spark",version:"gpt-5.3-codex-spark",importance:5,stage:"Preview",summary:"실시간 코딩을 위한 경량 변종. Cerebras Wafer Scale Engine 3 위에서 1000+ tokens/s, 표준 Codex 대비 15× 빠름. ChatGPT Pro 사용자에게 리서치 프리뷰로 롤아웃.",url:"https://openai.com/index/introducing-gpt-5-3-codex-spark/"},
];
