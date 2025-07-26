import React, { useState, useEffect, useCallback } from 'react';
import { Presentation } from '../services/openaiService';
import './PresentationDisplay.css';

interface PresentationDisplayProps {
  presentation: Presentation;
  theme?: string;
  onClose?: () => void;
}

export const PresentationDisplay: React.FC<PresentationDisplayProps> = ({ 
  presentation, 
  theme = 'party',
  onClose 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = presentation.slides.length;

  const showSlide = useCallback((n: number) => {
    const newSlide = Math.max(0, Math.min(n, totalSlides - 1));
    setCurrentSlide(newSlide);
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      showSlide(currentSlide + 1);
    }
  }, [currentSlide, totalSlides, showSlide]);

  const previousSlide = useCallback(() => {
    if (currentSlide > 0) {
      showSlide(currentSlide - 1);
    }
  }, [currentSlide, showSlide]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.warn);
    } else {
      document.exitFullscreen().catch(console.warn);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousSlide();
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else if (onClose) {
            onClose();
          }
          break;
        case 'F11':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, previousSlide, toggleFullscreen, onClose]);

  const currentSlideData = presentation.slides[currentSlide];
  const themeStyles = getThemeStyles(theme);

  return (
    <div 
      className={`presentation-display ${theme}-theme`}
      style={{
        background: themeStyles.background,
        color: themeStyles.color,
        backgroundImage: currentSlideData?.imageUrl ? `url(${currentSlideData.imageUrl})` : 'none'
      }}
    >
      <div className="presentation-container">
        <div className="presentation-title">{presentation.title}</div>
        <div className="slide-counter">
          <span>{currentSlide + 1}</span> / {totalSlides}
        </div>
        
        {onClose && (
          <button className="close-button" onClick={onClose} title="Close presentation">
            ✕
          </button>
        )}
        
        <div 
          className={`slide ${currentSlideData?.imageUrl ? 'slide-with-background' : ''} active`}
        >
          {!currentSlideData?.imageUrl && (
            <div className="slide-emoji">{currentSlideData?.emoji}</div>
          )}
          <h1 className="slide-title">{currentSlideData?.title}</h1>
          {currentSlideData?.content && (
            <div className="slide-content">{currentSlideData.content}</div>
          )}
        </div>
        
        <div className="navigation">
          <button 
            className="nav-button" 
            onClick={previousSlide}
            disabled={currentSlide === 0}
          >
            ← Previous
          </button>
          <button 
            className="nav-button" 
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
          >
            Next →
          </button>
        </div>
        
        <div className="keyboard-hint">
          Use arrow keys or buttons to navigate • Press F11 for fullscreen • Press Esc to {onClose ? 'close' : 'exit fullscreen'}
        </div>
      </div>
    </div>
  );
};

const getThemeStyles = (theme: string) => {
  const themes = {
    party: {
      background: 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
      color: '#ffffff'
    },
    neon: {
      background: 'linear-gradient(135deg, #00d2ff, #3a7bd5, #00f2fe, #4facfe)',
      color: '#ffffff'
    },
    sunset: {
      background: 'linear-gradient(135deg, #ff9a9e, #fecfef, #ffecd2, #fcb69f)',
      color: '#333333'
    },
    ocean: {
      background: 'linear-gradient(135deg, #667eea, #764ba2, #89f7fe, #66a6ff)',
      color: '#ffffff'
    },
    forest: {
      background: 'linear-gradient(135deg, #11998e, #38ef7d, #56ab2f, #a8edea)',
      color: '#ffffff'
    }
  };
  
  return themes[theme as keyof typeof themes] || themes.party;
};
