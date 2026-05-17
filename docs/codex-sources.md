# Codex 검증 출처

`codex.html` 데이터의 카테고리별 1차 출처 + URL 정밀도 정책. 2026-05-17 기준.

## 카테고리별 출처 표

| 카테고리 (key) | 1차 출처 | URL 패턴 | 정밀도 | 건수 |
|---|---|---|---|---|
| Codex CLI | `github.com/openai/codex/releases` | `/releases/tag/rust-v{X.Y.Z}` | tag anchor 100% | 22 |
| Codex App | `openai.com/index/` | `/index/<slug>/` (introducing-codex, codex-app, codex-for-almost-everything 등) | slug 100% | 6 |
| Models | `openai.com/index/` + `cdn.openai.com/pdf/` | `/index/introducing-gpt-5-X-codex/`, system card PDF URL | slug + PDF anchor 100% | 10 |
| Platform | `developers.openai.com/codex/changelog` | `#month-YYYY-MM` (month-level anchor) | ⚠️ **month only** — ADR-007 참조 | 8 |
| Dev Blog | `developers.openai.com/blog/topic/codex` | `/blog/<slug>` | slug 100% | 7 |
| Corporate | `openai.com/index/`, `developers.openai.com/codex/pricing`, `github.blog`, `techcrunch.com` | slug 또는 anchor | 100% (외부 보도 포함) | 6 |
| **합계** | | | | **59** |

## URL 정밀도 예외 — Platform 카테고리

`developers.openai.com/codex/changelog`는 항목별 anchor가 아닌 **월별 anchor**(`#month-2026-05`)만 제공한다. ADR-005의 "anchor/slug 정확도" 정책에 부분적으로 미달.

**대응**:
1. Platform 카테고리는 changelog month anchor 사용 허용 (ADR-007 명시).
2. 단, **다른 카테고리에서 더 정밀한 URL이 있으면 그쪽 우선** — 예: CLI 릴리스는 changelog 대신 GitHub `releases/tag/{ver}` 사용.
3. 한 이벤트가 changelog + GitHub release 양쪽에 있으면 두 카테고리(Platform · CLI)에 각각 별도 entry로 수록 (양 측에서 검증된 사실이므로 추정 아님).

## openai.com WebFetch 제약

`openai.com/index/<slug>` 페이지는 WebFetch로 직접 fetch 시 HTTP 403 응답. 본 작업에서는 다음 대체 검증을 사용:

1. **WebSearch 결과 listing**으로 slug + 게시일 확인
2. **외부 보도**(TechCrunch, Cerebras, GitHub Changelog 등)로 발표 사실 교차 검증
3. URL 자체는 search 결과의 정식 링크에서 추출 — slug 정확도 보장

따라서 `Codex App`/`Models`/`Corporate` 카테고리의 `openai.com/index/` URL은 직접 fetch는 못 했지만 **공식 검색 결과에 노출된 정식 페이지 URL**이며, 페이지가 실제로 존재함을 search 결과의 다중 인용으로 확인.

## 추정 거부 정책 (ADR-004 그대로 적용)

Codex 타임라인도 Claude 타임라인과 동일하게 `(추정)` 라벨 금지. 검증 못 한 항목은 누락. 본 v1에서 누락한 영역:

- v0.1.0 ~ v0.4.0 (GitHub API에 release object 없음 — repo 본문 URL로 초기 launch만 수록)
- 마이너 패치 alpha 릴리스 (v0.X.0-alpha.N) — 의미 없는 노이즈로 판단해 제외
- openai.com/research 의 Codex 관련 페이지 — 검증된 게 없음

## 향후 보강 영역

- developers.openai.com/codex/changelog 월별 entry 확장 (현재 4-5월만 수록, 2025-04부터 2026-03까지의 월별 entry 추가 가능)
- Codex enterprise 발표(`scaling-codex-to-enterprises-worldwide` slug WebSearch에서 발견) — 게시일 추가 확인 필요
- v0.45.0/v0.70.0/v0.85.0/v0.95.0 등 누락된 CLI 마이너 — 데이터 밀도 보강 시 추가 가능
