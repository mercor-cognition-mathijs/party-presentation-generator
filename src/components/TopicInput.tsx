import React from 'react';
import './TopicInput.css';

interface TopicInputProps {
  topics: string[];
  onTopicChange: (index: number, value: string) => void;
}

export const TopicInput: React.FC<TopicInputProps> = ({ topics, onTopicChange }) => {
  return (
    <div className="topic-input-section">
      <h3>Custom Topics (Optional)</h3>
      <p className="topic-description">
        Add 0-3 custom topics, or leave blank for completely random presentations!
      </p>
      
      {topics.map((topic, index) => (
        <div key={index} className="topic-input-group">
          <label htmlFor={`topic-${index}`}>Topic {index + 1}</label>
          <input
            type="text"
            id={`topic-${index}`}
            value={topic}
            onChange={(e) => onTopicChange(index, e.target.value)}
            placeholder={`Optional topic ${index + 1}...`}
            className="topic-input"
          />
        </div>
      ))}
      
      <div className="topic-hint">
        💡 Examples: "Space exploration", "Cooking disasters", "Time travel"
      </div>
    </div>
  );
};
