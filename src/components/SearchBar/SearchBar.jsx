import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Fetch word suggestions when input changes
  useEffect(() => {
    const controller = new AbortController(); // ✅ cancel previous fetches
    if (input.trim()) {
      fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(input)}&max=5`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setSuggestions(Array.isArray(data) ? data.slice(0, 6) : []))
        .catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        });
    } else {
      setSuggestions([]);
    }
    return () => controller.abort(); // ✅ cleanup
  }, [input]);
 
  const handleSearch = (word) => {
    const trimmed = word.trim();
    if (trimmed) {
      onSearch(trimmed);
      setInput(trimmed);
      setSuggestions([]);
      setShowSuggestions(false);
      inputRef.current?.blur(); // ✅ remove focus after search
    }
  };

  return (
    <div className="search-container">
      <div className="dict-page-title">Dictionary</div>
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Enter a word..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(input)}
          aria-label="Search word"
          autoComplete="off"
        />
        <button onClick={() => handleSearch(input)} className="search-button">
          <span className="icon" aria-hidden="true"><FaSearch /></span>
          
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((s) => (
            <li
              key={s.word}
              className="suggestion-item"
              onMouseDown={() => handleSearch(s.word)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(s.word)}
            >
              {s.word}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
