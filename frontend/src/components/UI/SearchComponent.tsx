import React, { useState, useCallback, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { API_BASE } from '../../config/config';

interface SearchResult {
  _id: string;
  title: string;
  description: string;
  type: string;
  link: string;
  score: number;
}

interface SearchComponentProps {
  onSearchResults: (results: SearchResult[]) => void;
  onClearSearch: () => void;
  hash?: string;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({ 
  onSearchResults, 
  onClearSearch,
  hash = ''
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('token');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced function to call the backend
  const fetchResults = useCallback(debounce(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsSearching(false);
      onClearSearch();
      return;
    }

    setIsSearching(true);
    try {
      let queryUrl;
      if (hash && hash.trim() !== '') {
        queryUrl = `${API_BASE}/search?q=${encodeURIComponent(q)}&hash=${hash}&limit=10`;
      } else {
        queryUrl = `${API_BASE}/search?q=${encodeURIComponent(q)}&limit=10`;
      }
      const resp = await fetch(
        queryUrl,
        {
          headers: { 
            Authorization: token || '' 
          }
        }
      );
      const data: SearchResult[] = await resp.json();
      setResults(data);
      setShowDropdown(true);
      onSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, 300), [token, onSearchResults, onClearSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchResults(value);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    onClearSearch();
  };

  const handleResultClick = (result: SearchResult) => {
    setShowDropdown(false);
    // Optionally set the search query to the selected result's title
    setQuery(result.title);
    // The parent component will handle filtering based on search results
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="h-4 w-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        
        <input
          type="text"
          placeholder="Search content..."
          value={query}
          onChange={handleChange}
          className="w-full pl-10 pr-10 py-4 border border-gray-100 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white shadow-md text-sm"
          style={{ minWidth: '250px' }}
        />
        
        {/* Clear button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                        rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            <div className="px-3 py-2 text-xs text-gray-500 font-medium border-b border-gray-100">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
            {results.map((item, idx) => (
              <button
                key={`${item._id}-${idx}`}
                onClick={() => handleResultClick(item)}
                className="w-full text-left px-3 py-3 hover:bg-gray-50 border-b border-gray-50 
                           last:border-b-0 transition-colors duration-150"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {item.description || 'No description available'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs 
                                       font-medium bg-gray-100 text-gray-800">
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        Score: {(item.score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {showDropdown && query && !isSearching && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                        rounded-lg shadow-lg z-50">
          <div className="px-3 py-6 text-center text-gray-500 text-sm">
            No content found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};