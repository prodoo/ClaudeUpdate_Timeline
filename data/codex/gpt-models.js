/* GPT Models — Codex 외 OpenAI 본체 모델 (GPT-5.x, o-series, Realtime, Voice)
 * Sources: openai.com/index/<slug>, github.blog/changelog
 * Verified: 2026-05-31 (날짜는 WebSearch + 외부 보도 교차 검증)
 * Note: openai.com/* 직접 fetch는 403이지만 slug URL은 search listing에서 확인됨.
 */
(window.EVENTS_BY_SOURCE = window.EVENTS_BY_SOURCE || {})["GPT Models"] = [
{date:"2025-04-16",title:"OpenAI o3 + o4-mini",version:"o3, o4-mini",importance:5,stage:"GA",summary:"o-series 추론 모델 — 더 오래 생각하는 모델. o3는 가장 똑똑한 모델, o4-mini는 빠르고 비용 효율적. Pro/Plus/Team 우선, o4-mini-high도 함께.",url:"https://openai.com/index/introducing-o3-and-o4-mini/"},
{date:"2025-04-24",title:"o4-mini 무료 사용자 + API 확장",version:"o4-mini",importance:3,stage:"GA",summary:"o4-mini를 ChatGPT 무료 사용자에게도 공개. Chat Completions API + Responses API에 추가.",url:"https://openai.com/index/introducing-o3-and-o4-mini/"},
{date:"2025-06-10",title:"o3-pro",version:"o3-pro",importance:4,stage:"GA",summary:"o3-pro가 ChatGPT Pro 사용자와 API에 공개.",url:"https://help.openai.com/en/articles/9624314-model-release-notes"},
{date:"2025-08-07",title:"GPT-5 출시",version:"gpt-5",importance:5,stage:"GA",summary:"OpenAI 차세대 대형 언어 모델. ChatGPT 무료 사용자 포함 전체 공개. ChatGPT/API/GitHub Models Playground에서 동시 롤아웃. 빠른 응답, 향상된 코딩·작문, 정확한 의학 답변, 낮은 환각률.",url:"https://openai.com/index/introducing-gpt-5/"},
{date:"2025-08-28",title:"gpt-realtime + Realtime API GA",version:"gpt-realtime",importance:5,stage:"GA",summary:"Realtime API가 beta에서 GA로 그래쥬에이트. gpt-realtime speech-to-speech 모델 — 복잡한 지시 따라가기, 정확한 tool calling, 자연스러운 음성. 신규 보이스 Cedar, Marin.",url:"https://openai.com/index/introducing-gpt-realtime/"},
{date:"2025-11-12",title:"GPT-5.1 (Instant + Thinking)",version:"gpt-5.1",importance:5,stage:"GA",summary:"GPT-5.1 패밀리 — Instant는 더 대화적이고 지시 따라가기·adaptive reasoning 강화. Thinking은 질문 복잡도에 맞춰 thinking time 정밀 조절.",url:"https://openai.com/index/gpt-5-1/"},
{date:"2025-11-12",title:"GPT-5.1 for Developers",version:"gpt-5.1",importance:4,stage:"GA",summary:"GPT-5.1 + GPT-5.1-Codex + GPT-5.1-Codex-Mini가 API에 출시. 에이전틱·코딩 작업 최적화.",url:"https://openai.com/index/gpt-5-1-for-developers/"},
{date:"2025-11-18",title:"GPT-5.1-Codex-Max System Card",version:"gpt-5.1-codex-max",importance:3,stage:"Paper",summary:"GPT-5.1-Codex-Max 시스템 카드 — 첫 multi-context-window 모델, compaction으로 백만 토큰 task 처리.",url:"https://cdn.openai.com/pdf/2a7d98b1-57e5-4147-8d0e-683894d782ae/5p1_codex_max_card_03.pdf"},
{date:"2025-12-11",title:"GPT-5.2 (frontier model)",version:"gpt-5.2",importance:5,stage:"GA",summary:"OpenAI 최신 frontier 모델 — 지식, 추론, 코딩 전반 개선.",url:"https://openai.com/index/introducing-gpt-5-2/"},
{date:"2025-12-18",title:"GPT-5 System Card Update: 5.2",version:"gpt-5.2",importance:3,stage:"Paper",summary:"GPT-5 시스템 카드의 GPT-5.2 업데이트.",url:"https://openai.com/index/gpt-5-system-card-update-gpt-5-2/"},
{date:"2026-04-23",title:"GPT-5.5 출시 (superapp 한 발 가까이)",version:"gpt-5.5",importance:5,stage:"GA",summary:"OpenAI의 가장 똑똑하고 직관적인 모델. 작문·디버깅, 온라인 리서치, 데이터 분석, 문서/스프레드시트 생성, 소프트웨어 조작, 도구 간 task 완료까지. Plus/Pro/Business/Enterprise에 롤아웃.",url:"https://openai.com/index/introducing-gpt-5-5/"},
{date:"2026-04-24",title:"GPT-5.5 + Pro API",version:"gpt-5.5",importance:4,stage:"GA",summary:"GPT-5.5 + GPT-5.5 Pro가 API에 공개. GPT-5.5 Pro는 Pro/Business/Enterprise 사용자에게 제공.",url:"https://openai.com/index/introducing-gpt-5-5/"},
{date:"2026-04-23",title:"GPT-5.5 System Card",version:"gpt-5.5",importance:3,stage:"Paper",summary:"GPT-5.5 시스템 카드.",url:"https://openai.com/index/gpt-5-5-system-card/"},
{date:"2026-05-05",title:"GPT-5.5 Instant (ChatGPT 기본)",version:"gpt-5.5-instant",importance:4,stage:"GA",summary:"GPT-5.5 Instant가 ChatGPT의 새 기본 모델로 채택.",url:"https://openai.com/index/introducing-gpt-5-5/"},
{date:"2026-05-07",title:"GPT-Realtime 2 + Translate + Whisper",version:"gpt-realtime-2",importance:5,stage:"GA",summary:"Realtime API 3종 신규 모델 — GPT-Realtime-2(GPT-5급 추론으로 구성 가능한 reasoning, 첫 음성 GPT-5 기반), GPT-Realtime-Translate(70+ 언어 입력 → 13개 언어 실시간 번역, $0.034/분), GPT-Realtime-Whisper(speech-to-text 스트리밍).",url:"https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/"},
{date:"2026-05-07",title:"GPT-5.5-Cyber 제한 프리뷰 공개",version:"gpt-5.5-cyber",importance:3,stage:"Preview",summary:"OpenAI가 검증된 사이버 방어자를 대상으로 GPT-5.5-Cyber 제한 프리뷰를 열고 Trusted Access for Cyber 프로그램을 확대했다. 이 모델은 취약점 탐색, 악성코드 분석, 공격 역분석 등 방어 목적 작업에서 공개 모델보다 가드레일이 완화되어 있으나 자격 증명 탈취·악성코드 작성 같은 요청은 계속 차단된다.",url:"https://openai.com/index/gpt-5-5-with-trusted-access-for-cyber/"}
];
