import React, { useState, useEffect } from 'react';
import './App.css';
import { PresentationGenerator } from './components/PresentationGenerator';
import { ApiKeyInput } from './components/ApiKeyInput';

function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setIsApiKeySet(true);
    localStorage.setItem('openai-api-key', key);
  };

  const handleApiKeyReset = () => {
    setApiKey('');
    setIsApiKeySet(false);
    localStorage.removeItem('openai-api-key');
  };

  return (
    <div className="App">
      {!isApiKeySet ? (
        <ApiKeyInput onSubmit={handleApiKeySubmit} />
      ) : (
        <PresentationGenerator 
          apiKey={apiKey} 
          onResetApiKey={handleApiKeyReset}
        />
      )}
    </div>
  );
}

export default App;
