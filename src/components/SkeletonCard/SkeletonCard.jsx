import './SkeletonCard.css';

function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__image shimmer"></div>
      <div className="skeleton-card__content">
        <div className="skeleton-card__tags">
          <div className="skeleton-card__tag shimmer"></div>
          <div className="skeleton-card__tag shimmer"></div>
        </div>
        <div className="skeleton-card__title shimmer"></div>
        <div className="skeleton-card__title skeleton-card__title--short shimmer"></div>
        <div className="skeleton-card__footer">
          <div className="skeleton-card__btn shimmer"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
