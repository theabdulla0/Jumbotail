import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSuggestions } from "@/services/api";

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        const result = await getSuggestions(query);
        setSuggestions(result.data || []);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />

          <Input
            ref={inputRef}
            type="text"
            placeholder="Search phones, laptops, earphones... Try 'sasta iphone' or 'samsung 50k'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="pl-10 pr-20 h-12 text-base"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-16 p-1 hover:bg-muted rounded-full"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}

          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-1 h-10"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick Search Tags */}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {[
          "iPhone 16",
          "Samsung Galaxy",
          "sasta phone",
          "laptop under 50k",
          "boAt earphones",
        ].map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setQuery(tag);
              onSearch(tag);
            }}
            className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
