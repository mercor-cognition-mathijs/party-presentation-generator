import React, { useState, useEffect } from 'react';
import './PresentationGenerator.css';
import { TopicInput } from './TopicInput';
import { SlideCountSelector } from './SlideCountSelector';
import { GenerateButton } from './GenerateButton';
import { openPresentationWindow } from '../utils/presentationWindow';
import { generatePresentation } from '../services/openaiService';

interface PresentationGeneratorProps {
  apiKey: string;
  onResetApiKey: () => void;
}

export const PresentationGenerator: React.FC<PresentationGeneratorProps> = ({ 
  apiKey, 
  onResetApiKey 
}) => {
  const [topics, setTopics] = useState<string[]>(['', '', '']);
  const [slideCount, setSlideCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showPopupWarning, setShowPopupWarning] = useState<boolean>(false);
  const [hasSeenPopupWarning, setHasSeenPopupWarning] = useState<boolean>(false);

  useEffect(() => {
    const popupPermissionShown = localStorage.getItem('popup-permission-shown');
    if (popupPermissionShown === 'true') {
      setHasSeenPopupWarning(true);
    }
  }, []);

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleGenerate = async () => {
    if (!hasSeenPopupWarning) {
      setShowPopupWarning(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const filteredTopics = topics.filter(topic => topic.trim() !== '');
      const presentation = await generatePresentation(
        apiKey,
        filteredTopics,
        slideCount,
        'party'
      );
      
      openPresentationWindow(presentation, 'party');
    } catch (error) {
      console.error('Error generating presentation:', error);
      alert('Error generating presentation. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePopupWarningConfirm = () => {
    setShowPopupWarning(false);
    setHasSeenPopupWarning(true);
    localStorage.setItem('popup-permission-shown', 'true');
    handleGenerate();
  };

  return (
    <div className="presentation-generator">
      <header className="generator-header">
        <h1>🎪 Party Presentation Generator</h1>
        <button 
          className="reset-api-key-button"
          onClick={onResetApiKey}
          title="Change API Key"
        >
          🔑 Change API Key
        </button>
      </header>

      <div className="generator-content">
        {showPopupWarning && (
          <div className="popup-warning">
            <div className="popup-warning-content">
              <h3>🚨 Allow Popups!</h3>
              <p>Your presentation will open in a new window. Please allow popups for this site!</p>
              <button onClick={handlePopupWarningConfirm}>Got it! 👍</button>
            </div>
          </div>
        )}
        
        <div className="control-panel">
          <TopicInput 
            topics={topics}
            onTopicChange={handleTopicChange}
          />
          
          <SlideCountSelector 
            slideCount={slideCount}
            onSlideCountChange={setSlideCount}
          />
          
          <GenerateButton 
            onClick={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        <div className="preview-section">
          <div className="theme-preview theme-party">
            <h3>🎪 Ready to Party!</h3>
            <div className="preview-slide">
              <h2>Amazing Slides</h2>
              <p>Your AI-powered presentation will be visually stunning with minimal text and maximum impact!</p>
              <div className="preview-emoji">🎉</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
