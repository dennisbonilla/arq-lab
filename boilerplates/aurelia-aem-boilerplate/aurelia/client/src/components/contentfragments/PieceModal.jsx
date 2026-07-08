import { useEffect, useRef } from 'react';
import { AemImage, AemTitle } from '../aem/index.js';
import SpecStrip from './SpecStrip.jsx';

/**
 * PieceModal: full detail of a "Piece" Content Fragment.
 * Shows image (DAM), collection, name, notes and the hallmark (SpecStrip).
 *
 * Accessibility:
 *  - role="dialog" + aria-modal + aria-labelledby.
 *  - Esc and clicking the backdrop close it.
 *  - Locks body scroll while open.
 *  - Focuses the close button on open and returns focus on close.
 *  - Basic focus trap with Tab.
 */
export default function PieceModal({ piece, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };
  }, [onClose]);

  if (!piece) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="piece-modal-title"
        ref={dialogRef}
      >
        <div className="modal__media">
          <AemImage asset={piece.image} loading="eager" />
        </div>
        <div className="modal__body">
          <button ref={closeRef} className="modal__close" onClick={onClose} aria-label="Close">
            &times;
          </button>
          <span className="modal__collection">{piece.collection}</span>
          <AemTitle as="h2" id="piece-modal-title">{piece.name}</AemTitle>
          <p className="modal__notes">{piece.notes}</p>
          <SpecStrip
            metal={piece.metal}
            gemstone={piece.gemstone}
            carat={piece.carat}
            reference={piece.ref}
          />
        </div>
      </div>
    </div>
  );
}
