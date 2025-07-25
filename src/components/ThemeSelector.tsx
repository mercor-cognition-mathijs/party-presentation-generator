import React from 'react';
import './ThemeSelector.css';

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  { id: 'party', name: 'Party', emoji: '🎉' },
  { id: 'neon', name: 'Neon', emoji: '⚡' },
  { id: 'sunset', name: 'Sunset', emoji: '🌅' },
  { id: 'ocean', name: 'Ocean', emoji: '🌊' },
  { id: 'forest', name: 'Forest', emoji: '🌲' }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  selectedTheme, 
  onThemeChange 
}) => {
  return (
    <div className="theme-selector-section">
      <h3>Choose Theme</h3>
      <p className="theme-description">
        Select a color theme for your presentation
      </p>
      
      <div className="theme-grid">
        {themes.map((theme) => (
          <button
            key={theme.id}
            className={`theme-option theme-${theme.id} ${
              selectedTheme === theme.id ? 'selected' : ''
            }`}
            onClick={() => onThemeChange(theme.id)}
          >
            <span className="theme-emoji">{theme.emoji}</span>
            <span className="theme-name">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
