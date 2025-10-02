import { useState } from 'react';
import './Translator.css';

export default function Translator() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [text, setText] = useState('');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'it', label: 'Italian' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'ru', label: 'Russian' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ta', label: 'Tamil' },
    { code: 'te', label: 'Telugu' }
  ];

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (translated) setText(translated);
  };

  const libreEndpoints = [
    'https://libretranslate.de/translate',
    'https://libretranslate.com/translate',
    'https://translate.argosopentech.com/translate'
  ];

  async function translateViaLibre(endpoint, q, source, target) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ q, source, target, format: 'text' })
    });
    if (!res.ok) throw new Error(`LibreTranslate failed: ${res.status}`);
    const data = await res.json();
    if (!data || typeof data.translatedText !== 'string') {
      throw new Error('LibreTranslate invalid response');
    }
    return data.translatedText;
  }

  async function translateViaMyMemory(q, source, target) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${encodeURIComponent(source)}|${encodeURIComponent(target)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`MyMemory failed: ${res.status}`);
    const data = await res.json();
    const out = data?.responseData?.translatedText;
    if (!out) throw new Error('MyMemory invalid response');
    return out;
  }

  const handleTranslate = async () => {
    setError('');
    setTranslated('');
    const trimmed = text.trim();
    if (!trimmed) return;
    if (sourceLang === targetLang) {
      setTranslated(trimmed);
      return;
    }

    setLoading(true);
    try {
      let result = '';
      let lastError = null;
      for (const ep of libreEndpoints) {
        try {
          result = await translateViaLibre(ep, trimmed, sourceLang, targetLang);
          if (result) break;
        } catch (e) {
          lastError = e;
        }
      }

      if (!result) {
        result = await translateViaMyMemory(trimmed, sourceLang, targetLang);
      }

      setTranslated(result || '');
    } catch (e) {
      setError('Unable to translate right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="translator-container">
      {/* Two-column layout */}
      <div className="translator-grid">

        {/* Left Column - Input Section */}
        <div className="translator-input-section">
          {/* Title */}
          <h3 className="translator-title">Translator</h3>

          {/* Language Controls */}
          <div className="translator-controls">
            <div className="translator-select-group">
              <label htmlFor="sourceLang" className="translator-label">
                From
              </label>
              <select
                id="sourceLang"
                className="translator-select"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>

            <button
              className="translator-swap-button"
              onClick={swapLanguages}
              aria-label="Swap languages"
            >
              ⇄
            </button>

            <div className="translator-select-group">
              <label htmlFor="targetLang" className="translator-label">
                To
              </label>
              <select
                id="targetLang"
                className="translator-select"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Text Input Area */}
          <textarea
            className="translator-textarea"
            placeholder="Enter text to translate..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Translate Button */}
          <button
            className="translator-button"
            onClick={handleTranslate}
            disabled={loading || !text.trim()}
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>

          {/* Error Display */}
          {error && (
            <div className="translator-error">
              {error}
            </div>
          )}
        </div>

        {/* Right Column - Output Section */}
        <div className="translator-output-section">


          {/* Output Area - Always visible */}
          <div className="translator-output">
            {translated ? (
              <div className="translator-output-content">
                {translated}
              </div>
            ) : (
              <div className="translator-output-placeholder">
                Translation will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}