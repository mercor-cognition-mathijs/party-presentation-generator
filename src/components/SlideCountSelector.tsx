import React from 'react';
import './SlideCountSelector.css';

interface SlideCountSelectorProps {
  slideCount: number;
  onSlideCountChange: (count: number) => void;
}

export const SlideCountSelector: React.FC<SlideCountSelectorProps> = ({ 
  slideCount, 
  onSlideCountChange 
}) => {
  const slideCounts = [3, 4, 5, 6, 7];

  return (
    <div className="slide-count-section">
      <h3>Number of Slides</h3>
      <p className="slide-count-description">
        Choose how many slides your presentation should have
      </p>
      
      <div className="slide-count-options">
        {slideCounts.map((count) => (
          <button
            key={count}
            className={`slide-count-option ${
              slideCount === count ? 'selected' : ''
            }`}
            onClick={() => onSlideCountChange(count)}
          >
            {count}
          </button>
        ))}
      </div>
      
      <div className="slide-count-hint">
        📊 Selected: {slideCount} slides
      </div>
    </div>
  );
};
