# ChatGPT 검증 출처 (codex.html / 9 lane)

`codex.html` 데이터의 카테고리별 1차 출처 + URL 정밀도 정책. 2026-05-17 기준 (ADR-008 리브랜드 반영).

## 카테고리별 출처 표

| 카테고리 (key) | 1차 출처 | URL 패턴 | 정밀도 | 건수 |
|---|---|---|---|---|
| Codex CLI | `github.com/openai/codex/releases` | `/releases/tag/rust-v{X.Y.Z}` | tag anchor 100% | 58 |
| Codex App | `openai.com/index/` | `/index/<slug>/` (introducing-codex, codex-app, codex-for-almost-everything 등) | slug 100% | 7 |
| Codex Models | `openai.com/index/` | `/index/introducing-gpt-5-X-codex/` 등 | slug 100% | 9 |
| GPT Models | `openai.com/index/` + `cdn.openai.com/pdf/` | `/index/<slug>` (gpt-5, gpt-5-1, gpt-realtime 등) | slug 100% | 15 |
| Platform | `developers.openai.com/codex/changelog` | `#month-YYYY-MM` (month anchor) | ⚠️ month only — ADR-007 예외 | 8 |
| Research | `cdn.openai.com/pdf/` + `openai.com/index/<...-system-card>` + arxiv | PDF UUID URL 또는 slug | 100% | 8 |
| Dev Blog | `developers.openai.com/blog/topic/codex` | `/blog/<slug>` | slug 100% | 7 |
| Corporate | `openai.com/index/`, `developers.openai.com/codex/{pricing,integrations}`, `github.blog/changelog` | slug 또는 anchor | 100% | 9 |
| Community | techcrunch.com, cerebras.ai/blog, tomshardware.com, 9to5mac.com, news.ycombinator.com | 게시글 URL 또는 HN item id | 100% | 10 |
| **합계** | | | | **131** |

## URL 정밀도 — Platform lane 예외 (ADR-007 그대로)

`developers.openai.com/codex/changelog`는 항목별 anchor가 아닌 **월별 anchor**(`#month-YYYY-MM`)만 제공.

- Platform 카테고리는 changelog month anchor 사용 허용
- 다른 카테고리(특히 CLI)에서 더 정밀한 URL이 있으면 그쪽 우선 — CLI 릴리스는 GitHub `releases/tag/{ver}` 사용
- 한 사건이 changelog + GitHub release 양쪽에 있으면 두 카테고리(Platform · CLI)에 각각 별도 entry로 수록

## openai.com WebFetch 제약

`openai.com/index/<slug>` 페이지는 WebFetch로 직접 fetch 시 HTTP 403 (Cloudflare bot 차단). 본 작업의 대체 검증:
1. **WebSearch 결과 listing**으로 slug + 게시일 확인
2. **외부 보도**(TechCrunch, 9to5Mac, Cerebras Blog, GitHub Changelog 등)로 발표 사실 교차 검증
3. URL 자체는 search 결과의 정식 링크에서 추출 — slug 정확도 보장

## GitHub API rate limit 제약

GitHub API는 unauthenticated 시 60 req/hr. CLI 보강(70+ 개별 tag fetch)에서 rate limit에 걸려 일부 누락:
- 누락: v0.62, v0.67, v0.68, v0.70, v0.77~v0.79, v0.81~v0.89, v0.91~v0.99, v0.101~v0.109, v0.111~v0.114, v0.116~v0.119, v0.121~v0.127
- 향후 보강 시 GitHub PAT 인증 사용으로 5000 req/hr 한도 확보 가능

## 추정 거부 정책 (ADR-004 그대로)

- 모든 lane에 `(추정)` / `(가정)` / `(추측)` 라벨 금지
- Community lane만 `(커뮤니티 분석)` 라벨 허용 (Claude의 Stealth lane과 동일)
- 검증 못 한 항목은 누락 — 빈자리는 출처 검증 후 보강

## 의도적 제외 영역 (ADR-008 명시)

ChatGPT 페이지지만 다음은 의도적 제외:
- **ChatGPT consumer 앱 기능**: 메모리, custom GPTs, search, advanced voice mode 등 (코딩 thread 아님)
- **멀티모달**: Sora, DALL-E, 이미지·비디오 생성 (코딩 thread 아님)
- **Operator·Atlas·기타 비-코딩 surface**

이유: "ChatGPT 우산 아래 OpenAI 코딩 생태계"라는 범위 정의를 유지하기 위해. 사용자 명시 정책.

## 향후 보강 영역

- GitHub API authenticated fetch로 누락된 ~30 CLI stable 추가 (~88건 가능)
- `developers.openai.com/codex/changelog` 2025-04~2026-03 월별 entry 추가 (Platform → 20+)
- Research lane에 openai.com/research/index/release 의 코딩/agentic 글 추가
- Community lane에 SWE-bench leaderboard 변동, Reddit 주요 분석 등 추가
