import React from 'react';

export const RatingStars = ({ rating = 5.0, count = 0, showCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-on-surface">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="material-symbols-outlined filled-icon text-[14px]">star</span>
        ))}
        {hasHalfStar && (
          <span className="material-symbols-outlined text-[14px]">star_half</span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="material-symbols-outlined text-[14px] text-outline">star</span>
        ))}
      </div>
      {showCount && (
        <span className="text-[12px] text-on-surface-variant ml-1">
          ({count})
        </span>
      )}
    </div>
  );
};
