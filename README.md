# Claude 2026 · a timeline

2026년 1월 1일 ~ 5월 14일 기간의 **Anthropic 관련 공식 업데이트 214건**을 8개 카테고리로 묶어 가로 시간축에 시각화하는 단일 페이지.

배포: https://prodoo.github.io/ClaudeUpdate_Timeline/

로컬 실행: `index.html` 더블클릭 → 의존성·빌드 없음.

## 구조

```
.
├── index.html                ← 시각화 페이지 (CSS·JS 인라인)
├── data/
│   ├── cc.js                 ← Claude Code 96건 (GitHub CHANGELOG)
│   ├── apps.js               ← Claude Apps 24건 (support.claude.com)
│   ├── api.js                ← API Platform 28건 (platform.claude.com)
│   ├── eng.js                ← Engineering 9건 (anthropic.com/engineering)
│   ├── red.js                ← Frontier Red Team 6건 (red.anthropic.com)
│   ├── res.js                ← Research 27건 (anthropic.com/research + alignment.anthropic.com)
│   ├── corp.js               ← Corporate 15건 (anthropic.com/news)
│   └── stl.js                ← Stealth 9건 (2026-03-31 source map leak 분석 글)
├── README.md                 ← 이 파일
├── .gitignore                ← .claude/ 등 로컬 설정 제외
└── .nojekyll                 ← GitHub Pages가 underscore 폴더 무시 안 하게
```

## 데이터 스키마

각 이벤트 객체:

```js
{
  date: "YYYY-MM-DD",      // 정렬·x축 매핑 기준
  title: "...",            // 짧은 제목
  version: "v2.1.84" | "", // 해당 시 버전
  importance: 1-5,         // 5=메이저 신모델/플랫폼, 4=중요 기능, 3=일반, 2=마이너, 1=버그픽스
  stage: "GA" | "Preview" | "Beta" | "Hidden" | "Blog" | "Paper" | "News" | "Press" | "Report",
  summary: "1-2문장 한국어 요약",
  url: "정확한 출처 URL (앵커·slug 포함)"
}
```

`source` 필드는 파일명이 자동 주입 — 각 `data/*.js`는 카테고리 키로 push.

## 8개 카테고리·출처

| 카테고리 (key)         | 컬러     | 건수 | 1차 출처 |
|---|---|---|---|
| Claude Code            | `#C6604E` | 96 | https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md |
| Claude Apps            | `#6B95B8` | 24 | https://support.claude.com/en/articles/12138966-release-notes |
| API Platform           | `#B89968` | 28 | https://platform.claude.com/docs/en/release-notes/api |
| Engineering            | `#A8A06D` |  9 | https://www.anthropic.com/engineering |
| Red Team               | `#9C3344` |  6 | https://red.anthropic.com |
| Research               | `#7DA67E` | 27 | https://www.anthropic.com/research + https://alignment.anthropic.com |
| Corporate              | `#7A6B5D` | 15 | https://www.anthropic.com/news |
| Stealth (code)         | `#6B5C8A` |  9 | alex000kim.com · wavespeed.ai/blog · venturebeat.com (2026-03-31 leak 분석) |
| **합계**               |         | **214** | |

## 검증 정책

1. **추정 금지**: 출처 페이지에서 명시적으로 확인된 항목만. 만약 출처가 비공식(유출·커뮤니티 분석)이라면 Stealth 카테고리로 분류하고 summary에 `(커뮤니티 추정)` 표시.
2. **URL 정확성**: 가능한 한 anchor 또는 개별 글 slug까지 포함. 예: `platform.claude.com/docs/en/release-notes/api#january-29-2026`. 일반 카테고리 페이지로만 링크하면 검증 가치가 떨어짐.
3. **누락 우선**: 검증 못 한 항목은 빼는 게 낫다 (남기면서 "(추정)" 라벨 붙이는 것보다).

## 데이터 추가 방법

1. `data/<category>.js`의 배열 끝에 새 객체 추가 (스키마 준수)
2. WebFetch 등으로 출처 URL을 직접 검증 — 가능하면 anchor·slug 포함
3. `index.html` 더블클릭으로 새 항목이 정확한 lane·날짜에 렌더링되는지 확인
4. 새 카테고리 추가 시: `index.html`의 `SOURCES` 배열에 항목 추가 + `<script src>` 태그 추가 + 컬러 변수 정의 (`--c-<key>`)

## 인터랙션

- **검색**: title/summary/version/source 부분일치, 비매칭 항목 흐려짐
- **의미론적 줌**: importance 임계값 슬라이더 (≥1 ~ ≥5)
- **시간축 줌**: 1× / 2× / 4× / 8× — 가로 스크롤
- **JUMP**: Jan/Feb/Mar/Apr/May/TODAY 버튼으로 해당 월 이동
- **소스 토글**: 사이드바 체크박스로 카테고리별 표시·숨김
- **다크 모드**: 우측 상단 토글, `localStorage` 저장
- **버블 호버**: 툴팁 표시 (제목·날짜·소스·버전·단계·중요도·요약)
- **버블 클릭**: 출처 URL 새 탭

## 라이선스

데이터는 모두 Anthropic 공식 발표 자료(또는 공개 커뮤니티 분석)에서 수집한 공개 정보. 시각화 코드는 자유 사용 가능.

## 마지막 갱신

2026-05-14 · 214건 검증 완료
