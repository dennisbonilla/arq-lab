/*
 * Piece modal for AEM (ported from PieceModal.jsx).
 * The card (piece-card.html) carries data-* with the detail; this JS opens an
 * accessible dialog: Esc, backdrop click, scroll lock, focus and Tab trap.
 * It doesn't depend on React: it's a site clientlib.
 */
(function () {
  'use strict';
  var backdrop, lastFocus;

  function close() {
    if (!backdrop) return;
    document.body.style.overflow = '';
    backdrop.parentNode && backdrop.parentNode.removeChild(backdrop);
    backdrop = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (!backdrop) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') {
      var f = backdrop.querySelectorAll('button,[href],[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function open(card) {
    lastFocus = document.activeElement;
    var d = card.dataset;
    backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="piece-modal-title">' +
        '<div class="modal__media">' +
          '<img src="' + d.image + '" alt="' + (d.alt || '') + '">' +
        '</div>' +
        '<div class="modal__body">' +
          '<button class="modal__close" aria-label="Close">&times;</button>' +
          '<span class="modal__collection">' + d.collection + '</span>' +
          '<h2 id="piece-modal-title">' + d.name + '</h2>' +
          '<p class="modal__notes">' + d.notes + '</p>' +
          '<div class="spec-strip">' +
            '<span>' + d.labelMetal + ' <b>' + d.metal + '</b></span>' +
            '<span>' + d.labelGem + ' <b>' + d.gemstone + '</b></span>' +
            '<span>' + d.labelCarat + ' <b class="score">' + d.carat + '</b></span>' +
            '<span>' + d.labelRef + ' <b>' + d.ref + '</b></span>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    backdrop.addEventListener('mousedown', function (e) { if (e.target === backdrop) close(); });
    backdrop.querySelector('.modal__close').addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    backdrop.querySelector('.modal__close').focus();
  }

  document.addEventListener('click', function (e) {
    var card = e.target.closest && e.target.closest('.piece-card');
    if (card) { e.preventDefault(); open(card); }
  });
})();
