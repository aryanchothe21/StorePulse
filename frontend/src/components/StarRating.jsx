import { useState } from 'react';


function StarRating({ value, onSubmit, disabled }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`star ${n <= (hovered || value || 0) ? 'filled' : ''}`}
          onMouseEnter={() => !disabled && setHovered(n)}
          onMouseLeave={() => !disabled && setHovered(0)}
          onClick={() => !disabled && onSubmit(n)}
          role="button"
          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
