/* Codex Models — Codex 전용 모델 변종 (codex-mini, GPT-X-Codex 계열)
 * Sources: openai.com/index/<slug>
 * Verified: 2026-05-17
 * Note: 시스템 카드는 Research lane으로 분리. 본체 GPT 모델은 GPT Models lane.
 */
(window.EVENTS_BY_SOURCE = window.EVENTS_BY_SOURCE || {})["Codex Models"] = [
{date:"2025-04-16",title:"codex-mini-latest API",version:"codex-mini",importance:4,stage:"GA",summary:"Codex CLI와 함께 codex-mini-latest API 모델 공개. o-series 계열의 코딩 특화 경량 모델.",url:"https://github.com/openai/codex"},
{date:"2025-09-15",title:"GPT-5-Codex 발표 (Introducing upgrades to Codex)",version:"gpt-5-codex",importance:5,stage:"GA",summary:"Codex 전용으로 GPT-5를 추가 학습한 모델. 풀 프로젝트 빌드, 기능 추가, 디버깅, 대규모 리팩터, 코드 리뷰까지 에이전틱 SW 엔지니어링 최적화.",url:"https://openai.com/index/introducing-upgrades-to-codex/"},
{date:"2025-09-23",title:"GPT-5-Codex API 일반 공개",version:"gpt-5-codex",importance:4,stage:"GA",summary:"API 키 사용자에게 GPT-5-Codex 공개. Codex CLI v0.40.0에서 기본 모델로 채택.",url:"https://github.com/openai/codex/releases/tag/rust-v0.40.0"},
{date:"2025-11-07",title:"GPT-5-Codex-Mini",version:"gpt-5-codex-mini",importance:4,stage:"GA",summary:"GPT-5-Codex의 더 작고 비용 효율적인 버전. Codex CLI v0.56.0에서 도입.",url:"https://github.com/openai/codex/releases/tag/rust-v0.56.0"},
{date:"2025-11-12",title:"GPT-5.1-Codex + Codex-Mini",version:"gpt-5.1-codex",importance:5,stage:"GA",summary:"GPT-5.1 패밀리의 Codex 변종 — gpt-5.1-codex(장기 에이전틱 코딩 최적화), gpt-5.1-codex-mini(저비용). API에 동시 출시.",url:"https://openai.com/index/gpt-5-1-for-developers/"},
{date:"2025-11-19",title:"GPT-5.1-Codex-Max",version:"gpt-5.1-codex-max",importance:5,stage:"GA",summary:"새 frontier agentic 코딩 모델. compaction으로 multi-context-window 작업, 백만 토큰 단일 task, 프로젝트 규모 refactor, 멀티 시간 agent loop. Codex CLI v0.65.0(12-04)에서 기본 모델로 채택.",url:"https://openai.com/index/gpt-5-1-codex-max/"},
{date:"2025-12-18",title:"GPT-5.2-Codex",version:"gpt-5.2-codex",importance:5,stage:"GA",summary:"GPT-5.2 기반 에이전틱 코딩 최적화. context compaction으로 장시간 작업, 대규모 리팩터·마이그레이션, Windows 환경 개선, 사이버보안 능력 강화. SWE-Bench Pro / Terminal-Bench 2.0 SOTA.",url:"https://openai.com/index/introducing-gpt-5-2-codex/"},
{date:"2026-02-05",title:"GPT-5.3-Codex",version:"gpt-5.3-codex",importance:5,stage:"GA",summary:"가장 강력한 에이전틱 코딩 모델. GPT-5.2-Codex 코딩 + GPT-5.2 추론·전문지식 단일 모델 통합. 25% 더 빠르고 self-train(bootstrapped).",url:"https://openai.com/index/introducing-gpt-5-3-codex/"},
{date:"2026-02-12",title:"GPT-5.3-Codex-Spark",version:"gpt-5.3-codex-spark",importance:5,stage:"Preview",summary:"실시간 코딩용 경량 변종. Cerebras WSE-3 위에서 1000+ tokens/s, 표준 Codex 대비 15× 빠름. ChatGPT Pro 리서치 프리뷰.",url:"https://openai.com/index/introducing-gpt-5-3-codex-spark/"},
];
