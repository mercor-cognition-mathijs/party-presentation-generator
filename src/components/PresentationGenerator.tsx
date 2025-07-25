import React, { useState } from 'react';
import './PresentationGenerator.css';
import { TopicInput } from './TopicInput';
import { ThemeSelector } from './ThemeSelector';
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
  const [selectedTheme, setSelectedTheme] = useState<string>('party');
  const [slideCount, setSlideCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const filteredTopics = topics.filter(topic => topic.trim() !== '');
      const presentation = await generatePresentation(
        apiKey,
        filteredTopics,
        slideCount,
        selectedTheme
      );
      
      openPresentationWindow(presentation, selectedTheme);
    } catch (error) {
      console.error('Error generating presentation:', error);
      alert('Error generating presentation. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
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
        <div className="control-panel">
          <TopicInput 
            topics={topics}
            onTopicChange={handleTopicChange}
          />
          
          <ThemeSelector 
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
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
          <div className={`theme-preview theme-${selectedTheme}`}>
            <h3>Theme Preview: {selectedTheme}</h3>
            <div className="preview-slide">
              <h2>Sample Slide Title</h2>
              <p>This is how your presentation will look with the {selectedTheme} theme.</p>
              <div className="preview-emoji">🎉</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
