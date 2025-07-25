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
  const funnyMessages = [
    "🤖 Teaching AI to party...",
    "🎨 Mixing digital paint with unicorn tears...",
    "🧠 Convincing pixels to dance...",
    "🎭 Rehearsing with virtual comedians...",
    "🚀 Launching creativity rockets...",
    "🎪 Training circus elephants to code...",
    "🌟 Sprinkling magic presentation dust...",
    "🎵 Composing slide symphonies...",
    "🦄 Bribing unicorns for inspiration...",
    "🎲 Rolling dice of awesomeness..."
  ];

  const [currentMessage, setCurrentMessage] = React.useState(0);

  React.useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % funnyMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isGenerating, funnyMessages.length]);

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
            {funnyMessages[currentMessage]}
          </>
        ) : (
          <>
            🎪 Generate Presentation
          </>
        )}
      </button>
      
      <p className="generate-hint">
        {isGenerating 
          ? 'Hold tight! We\'re doing some seriously silly AI magic behind the scenes! 🎭✨' 
          : 'Click to generate and open your presentation in a new window!'
        }
      </p>
    </div>
  );
};
