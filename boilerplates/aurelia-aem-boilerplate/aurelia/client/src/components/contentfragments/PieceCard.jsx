import { AemImage } from '../aem/index.js';

/**
 * PieceCard: compact card representing ONE Content Fragment of the "Piece" model.
 * Shows only the image (DAM) + collection + name + gemstone, and clicking opens
 * the detail in a modal (see PieceModal). The full hallmark lives in the modal.
 *
 * It's a <button> so it's keyboard accessible (Enter/Space) and focusable.
 * In AEM, the grid item references the CF; "open detail" can be resolved
 * with a client-side dialog or by navigating to a fragment detail view.
 */
export default function PieceCard({ piece, onOpen }) {
  return (
    <button
      type="button"
      className="piece-card"
      onClick={() => onOpen(piece)}
      aria-label={`${piece.name} — ${piece.collection}. View detail`}
    >
      <span className="media">
        <AemImage asset={piece.image} sizes="(max-width: 700px) 50vw, 25vw" />
        <span className="carat-tag">{piece.carat}</span>
      </span>
      <span className="caption">
        <span className="collection">{piece.collection}</span>
        <span className="name-line">{piece.name}</span>
        <span className="gem">{piece.gemstone}</span>
      </span>
    </button>
  );
}
