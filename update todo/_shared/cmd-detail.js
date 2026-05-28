/* ============ Command-detail drawer (interaction logic)
   플레이북 12편 공유 인터랙션 로직.
   - 데이터는 window.COMMAND_DETAILS에서 읽음 (각 HTML이 인라인 정의)
   - .cmd-badge 셀 중 키가 매칭되는 것만 트리거 부여
   - 드로어 DOM은 동적 생성 (HTML 변경 최소화)
============ */
(function() {
  const DATA = window.COMMAND_DETAILS || {};
  if (Object.keys(DATA).length === 0) return;

  // ---------- 드로어 DOM 동적 생성 ----------
  const backdrop = document.createElement('div');
  backdrop.className = 'cmd-detail-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');

  const drawer = document.createElement('aside');
  drawer.className = 'cmd-detail-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML =
    '<div class="cmd-detail-head">' +
      '<span class="cmd-detail-badge"></span>' +
      '<button type="button" class="cmd-detail-close" aria-label="닫기">✕</button>' +
    '</div>' +
    '<div class="cmd-detail-body"></div>';

  document.body.appendChild(backdrop);
  document.body.appendChild(drawer);

  const badge = drawer.querySelector('.cmd-detail-badge');
  const body = drawer.querySelector('.cmd-detail-body');
  const closeBtn = drawer.querySelector('.cmd-detail-close');
  let lastFocus = null;

  function render(key, detail) {
    badge.textContent = key;
    body.innerHTML =
      '<div class="cmd-detail-section">' +
        '<div class="cmd-detail-label">출처</div>' +
        '<div class="cmd-detail-source">' +
          (detail.source
            ? '<a href="' + detail.source + '" target="_blank" rel="noopener noreferrer">' + detail.sourceLabel + ' ↗</a>'
            : detail.sourceLabel) +
        '</div>' +
      '</div>' +
      '<div class="cmd-detail-section">' +
        '<div class="cmd-detail-label">설명</div>' +
        '<div class="cmd-detail-summary">' + detail.summary + '</div>' +
      '</div>' +
      '<div class="cmd-detail-section">' +
        '<div class="cmd-detail-label">사용 예시</div>' +
        '<pre class="cmd-detail-example">' + detail.example + '</pre>' +
      '</div>' +
      (detail.caution
        ? '<div class="cmd-detail-section">' +
            '<div class="cmd-detail-label">주의</div>' +
            '<div class="cmd-detail-caution">' + detail.caution + '</div>' +
          '</div>'
        : '') +
      '<div class="cmd-detail-section">' +
        '<div class="cmd-detail-label">버전</div>' +
        '<div class="cmd-detail-version">' + detail.version + '</div>' +
      '</div>';
  }

  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    setTimeout(function() { closeBtn.focus(); }, 50);
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // ---------- 트리거 부여 ----------
  document.querySelectorAll('.cmd-badge').forEach(function(cell) {
    const key = (cell.textContent || '').trim();
    const detail = DATA[key];
    if (!detail) return;  // 매칭 없으면 정적 셀 유지 (개념 라벨)

    cell.classList.add('cmd-detail-trigger');
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', '0');
    cell.addEventListener('click', function() {
      render(key, detail);
      openDrawer();
    });
    cell.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        render(key, detail);
        openDrawer();
      }
    });
  });

  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });
})();
