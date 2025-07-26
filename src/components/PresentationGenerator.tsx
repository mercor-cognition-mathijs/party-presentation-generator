import React, { useState, useEffect } from 'react';
import './PresentationGenerator.css';
import { TopicInput } from './TopicInput';
import { SlideCountSelector } from './SlideCountSelector';
import { GenerateButton } from './GenerateButton';
import { PresentationDisplay } from './PresentationDisplay';
import { openPresentationWindow } from '../utils/presentationWindow';
import { generatePresentation, Presentation } from '../services/openaiService';
import { mockPresentationScenarios } from '../utils/mockData';

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
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'popup' | 'react'>('react');
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);
  const [selectedMockScenario, setSelectedMockScenario] = useState<string>('Quick Demo (3 slides)');

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
    if (displayMode === 'popup' && !hasSeenPopupWarning) {
      setShowPopupWarning(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      let presentation: Presentation;
      
      if (isTestMode) {
        const mockGenerator = mockPresentationScenarios[selectedMockScenario as keyof typeof mockPresentationScenarios];
        if (typeof mockGenerator === 'function') {
          presentation = mockGenerator();
        } else {
          console.error('Mock generator not found for scenario:', selectedMockScenario);
          throw new Error(`Mock scenario "${selectedMockScenario}" not found`);
        }
      } else {
        const filteredTopics = topics.filter(topic => topic.trim() !== '');
        presentation = await generatePresentation(
          apiKey,
          filteredTopics,
          slideCount,
          'party'
        );
      }
      
      if (displayMode === 'popup') {
        openPresentationWindow(presentation, 'party');
      } else {
        setCurrentPresentation(presentation);
      }
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

  const handleClosePresentation = () => {
    setCurrentPresentation(null);
  };

  if (currentPresentation) {
    return (
      <PresentationDisplay 
        presentation={currentPresentation}
        theme="party"
        onClose={handleClosePresentation}
      />
    );
  }

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
          <div className="mode-toggles">
            <div className="toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={isTestMode}
                  onChange={(e) => setIsTestMode(e.target.checked)}
                />
                🧪 Test Mode (Use Mock Data)
              </label>
            </div>
            
            <div className="toggle-group">
              <label className="toggle-label">Display Mode:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="displayMode"
                    value="react"
                    checked={displayMode === 'react'}
                    onChange={(e) => setDisplayMode(e.target.value as 'react')}
                  />
                  📱 React Component
                </label>
                <label>
                  <input
                    type="radio"
                    name="displayMode"
                    value="popup"
                    checked={displayMode === 'popup'}
                    onChange={(e) => setDisplayMode(e.target.value as 'popup')}
                  />
                  🪟 Popup Window
                </label>
              </div>
            </div>

            {isTestMode && (
              <div className="toggle-group">
                <label className="toggle-label">Mock Scenario:</label>
                <select
                  value={selectedMockScenario}
                  onChange={(e) => setSelectedMockScenario(e.target.value)}
                  className="scenario-select"
                >
                  {Object.keys(mockPresentationScenarios).map(scenario => (
                    <option key={scenario} value={scenario}>
                      {scenario}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {!isTestMode && (
            <>
              <TopicInput 
                topics={topics}
                onTopicChange={handleTopicChange}
              />
              
              <SlideCountSelector 
                slideCount={slideCount}
                onSlideCountChange={setSlideCount}
              />
            </>
          )}
          
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
