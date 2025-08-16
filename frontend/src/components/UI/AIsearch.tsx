import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Settings } from 'lucide-react';
import { Button } from './Button';
import { API_BASE } from '../../config/config';

interface SearchResult {
  _id: string;
  title: string;
  description: string;
  type?: string;
  hash?: string;
}

interface AISearchBarProps {
  hash?: string;
}

const AISearchBar: React.FC<AISearchBarProps> = ({ hash }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const token = localStorage.getItem('token');
  // Default API key (you should replace this with your own default key)
  const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_APIKEY;
  
  const [apiKey, setApiKey] = useState('');
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showResults, setShowResults] = useState(false);

  
  // Gemini API configuration - Updated for 2025
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setAiResponse('');
    setShowResults(true);

    try {
      let queryUrl;
      if (hash && hash.trim() !== '') {
        queryUrl = `${API_BASE}/search?q=${encodeURIComponent(searchQuery)}&hash=${hash}&limit=10`;
      } else {
        queryUrl = `${API_BASE}/search?q=${encodeURIComponent(searchQuery)}&limit=10`;
      }
      const response = await fetch(
        queryUrl,
        {
          headers: { 
            Authorization: token || '' 
          }
        }
      );
      // const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(searchQuery)}&limit=3`);
      const results = await response.json();
      
      if (response.ok) {
        setSearchResults(results);
        
        // Always try to generate AI response if we have results
        if (results.length > 0) {
          await generateAIResponse(results);
        } else {
          setAiResponse('No relevant content found in your library for this query.');
        }
      } else {
        console.error('Search failed:', results.error);
        setAiResponse('Search failed. Please try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setAiResponse('Network error occurred during search. Please check your connection and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const generateAIResponse = async (results:SearchResult[]) => {
    // Determine which API key to use
    const keyToUse = useCustomKey && apiKey ? apiKey : DEFAULT_API_KEY;
    
    // Check if we have a valid API key
    if (!keyToUse || keyToUse.trim() === '' || keyToUse === 'undefined') {
      setAiResponse('Please configure a valid API key to get AI responses. Click the settings button to add your Gemini API key.');
      return;
    }

    setIsGeneratingAI(true);

    try {
      const contentContext = results.map((result , index) => 
        `${index + 1}. Title: ${result.title}\n   Description: ${result.description}\n   Type: ${result.type || 'Content'}`
      ).join('\n\n');

      const prompt = `Based on the user's search query: "${searchQuery}"

Here are the top relevant contents from their library:

${contentContext}

Please provide a helpful and comprehensive response that:
1. Addresses the user's query directly
2. References the relevant content from their library
3. Provides actionable insights or answers
4. Keep the response engaging and well-formatted
5. Use proper markdown formatting with headers and bullet points where appropriate
6. Avoid unnecessary asterisks or special characters that might display incorrectly

User Query: ${searchQuery}`;

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };

      const response = await fetch(`${GEMINI_API_URL}?key=${keyToUse}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          let responseText = data.candidates[0].content.parts[0].text;
          
          // Clean up the response text
          responseText = responseText
            .replace(/\*\*\*/g, '') // Remove triple asterisks
            .replace(/\*\*([^*]+)\*\*/g, '$1') // Convert **text** to just text for now
            .replace(/\*([^*]+)\*/g, '$1') // Convert *text* to just text for now
            .trim();
          
          setAiResponse(responseText);
        } else {
          console.error('Unexpected response structure:', data);
          setAiResponse('Received an unexpected response from the AI service. Please try again.');
        }
      } else {
        console.error('API Error:', response.status, data);
        if (response.status === 400) {
          setAiResponse('Invalid API request. Please check your API key and try again.');
        } else if (response.status === 403) {
          setAiResponse('API access denied. Please check your API key permissions or try creating a new key.');
        } else if (response.status === 429) {
          setAiResponse('Rate limit exceeded. Please wait a moment and try again.');
        } else {
          setAiResponse(`API Error (${response.status}): ${data.error?.message || 'Unknown error occurred'}`);
        }
      }
    } catch (error) {
      console.error('AI generation error:', error);
      setAiResponse('Network error occurred while generating AI response. Please check your connection and try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const closeResults = () => {
    setShowResults(false);
    setSearchResults([]);
    setAiResponse('');
  };

  const handleAIButtonClick = () => {
    setShowSearchBar(true);
  };

  const handleBackToButton = () => {
    setShowSearchBar(false);
    setSearchQuery('');
    setShowApiKeyInput(false);
  };

  // If search bar is not shown, display only the AI button
  if (!showSearchBar) {
    return (
      <div className="relative">
            <Button startIcon={<Sparkles/>} variant={"primary"} text={"AI"} onClick={handleAIButtonClick} size="sm"/>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Search Bar */}
      <div className="flex items-center gap-2">
        {/* Back button */}
        <button
          onClick={handleBackToButton}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title="Back"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Settings button for API key */}
        <button
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title="AI Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Search Input */}
        <div className="relative">
          <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
          <input
            type="text"
            placeholder="Ask AI about your content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-60 pl-9 pr-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-800 focus:border-transparent text-sm"
            autoFocus
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="text-sm py-2">AI Search</span>
        </button>
      </div>

      {/* API Key Input Dropdown */}
      {showApiKeyInput && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-80">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key Configuration
            </label>
            
            {/* Toggle between default and custom key */}
            <div className="mb-3">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="keyType"
                  checked={!useCustomKey}
                  onChange={() => setUseCustomKey(false)}
                  className="form-radio text-purple-600"
                />
                <span className="ml-2 text-sm text-gray-700">Use default API key</span>
              </label>
            </div>
            
            <div className="mb-3">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="keyType"
                  checked={useCustomKey}
                  onChange={() => setUseCustomKey(true)}
                  className="form-radio text-purple-600"
                />
                <span className="ml-2 text-sm text-gray-700">Use my own API key</span>
              </label>
            </div>
          </div>

          {/* Custom API Key Input */}
          {useCustomKey && (
            <div className="mb-3">
              <input
                type="password"
                placeholder="Enter your Gemini API key (AIza...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Google AI Studio</a>
              </p>
            </div>
          )}

          {/* Status indicator */}
          <div className="text-xs text-gray-600">
            {useCustomKey ? (
              apiKey ? (
                <span className="text-green-600">✓ Custom API key configured</span>
              ) : (
                <span className="text-orange-600">⚠ Please enter your API key</span>
              )
            ) : (
              DEFAULT_API_KEY && DEFAULT_API_KEY.trim() !== '' && DEFAULT_API_KEY !== 'undefined' ? (
                <span className="text-green-600">✓ Default API key active</span>
              ) : (
                <span className="text-orange-600">⚠ Default API key not configured</span>
              )
            )}
          </div>
        </div>
      )}

      {/* Results Modal/Overlay */}
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI Search Results
              </h3>
              <button
                onClick={closeResults}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Search Query: "{searchQuery}"</h4>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Found Content:</h4>
                  <div className="space-y-3">
                    {searchResults.map((result) => (
                      <div key={result._id} className="p-3 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900">{result.title}</h5>
                        <p className="text-gray-600 text-sm mt-1">{result.description}</p>
                        {result.type && (
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {result.type}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Response */}
              {(aiResponse || isGeneratingAI) && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-700 font-medium">AI Analysis</span>
                  </div>
                  {isGeneratingAI ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      <span className="text-purple-700">Generating response...</span>
                    </div>
                  ) : (
                    <div className="text-gray-800 whitespace-pre-wrap">{aiResponse}</div>
                  )}
                </div>
              )}

              {searchResults.length === 0 && !isSearching && aiResponse === '' && (
                <div className="text-center py-8 text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISearchBar;