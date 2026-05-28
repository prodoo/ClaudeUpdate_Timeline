(function () {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.dataset.theme = 'dark';
  }
  function syncLabel(btn) {
    var spans = btn.getElementsByTagName('span');
    if (spans.length < 2) return;
    var dark = document.documentElement.dataset.theme === 'dark';
    spans[0].textContent = dark ? '☀' : '☾';
    spans[1].textContent = dark ? 'LIGHT' : 'DARK';
  }
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('dark-btn');
    if (!btn) return;
    syncLabel(btn);
    btn.addEventListener('click', function () {
      var cur = document.documentElement.dataset.theme;
      if (cur === 'dark') {
        delete document.documentElement.dataset.theme;
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.dataset.theme = 'dark';
        localStorage.setItem('theme', 'dark');
      }
      syncLabel(btn);
    });
  });
})();
