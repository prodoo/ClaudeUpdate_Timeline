(function () {
  'use strict';

  function init() {
    var input = document.getElementById('cmd-search-input');
    var hint = document.getElementById('cmd-search-hint');
    var clearBtn = document.querySelector('.cmd-search-clear');
    var cardsRoots = document.querySelectorAll('.cards');
    if (!input || cardsRoots.length === 0) return;

    var cards = [];
    cardsRoots.forEach(function (root) {
      Array.prototype.forEach.call(root.querySelectorAll('.card'), function (c) {
        cards.push(c);
      });
    });
    if (cards.length === 0) return;

    var haystacks = cards.map(function (card) {
      var cmds = (card.getAttribute('data-commands') || '').toLowerCase();
      var txt = (card.textContent || '').toLowerCase();
      return cmds + ' ' + txt.replace(/\s+/g, ' ');
    });

    var emptyEl = document.createElement('div');
    emptyEl.className = 'cmd-search-empty';
    emptyEl.hidden = true;
    cardsRoots[cardsRoots.length - 1].appendChild(emptyEl);

    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, function (ch) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
      });
    }

    function update() {
      var q = input.value.trim().toLowerCase();
      clearBtn.hidden = q.length === 0;

      if (!q) {
        cards.forEach(function (c) { c.classList.remove('is-hidden'); });
        emptyEl.hidden = true;
        hint.hidden = true;
        hint.textContent = '';
        return;
      }

      var matched = 0;
      cards.forEach(function (card, i) {
        var hit = haystacks[i].indexOf(q) !== -1;
        card.classList.toggle('is-hidden', !hit);
        if (hit) matched++;
      });

      hint.hidden = false;
      if (matched === 0) {
        emptyEl.hidden = false;
        emptyEl.innerHTML = '<code>' + escapeHtml(input.value.trim()) + '</code> 일치하는 매뉴얼이 없습니다.';
        hint.innerHTML = '<b>0편</b> 일치';
      } else {
        emptyEl.hidden = true;
        hint.innerHTML = '<b>' + matched + '편</b> 일치';
      }
    }

    input.addEventListener('input', update);
    input.addEventListener('search', update);
    clearBtn.addEventListener('click', function () {
      input.value = '';
      input.focus();
      update();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
