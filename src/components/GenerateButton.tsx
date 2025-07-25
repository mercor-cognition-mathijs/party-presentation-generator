import React from 'react';
import './GenerateButton.css';

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ 
  onClick, 
  isGenerating 
}) => {
  return (
    <div className="generate-button-section">
      <button
        className={`generate-button ${isGenerating ? 'generating' : ''}`}
        onClick={onClick}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <span className="spinner"></span>
            Generating Presentation...
          </>
        ) : (
          <>
            🎪 Generate Presentation
          </>
        )}
      </button>
      
      <p className="generate-hint">
        {isGenerating 
          ? 'Creating your AI-powered presentation...' 
          : 'Click to generate and open your presentation in a new window!'
        }
      </p>
    </div>
  );
};
