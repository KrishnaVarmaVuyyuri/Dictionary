import './WordDetails.css';
import { HiVolumeUp } from 'react-icons/hi';

export default function WordDetails({ data, onFavorite }) {
    console.log(data)

    const playAudio = () => {
      try {
        const audioEntry = Array.isArray(data?.phonetics)
          ? data.phonetics.find(p => p && p.audio)
          : null;
        const audioUrl = audioEntry?.audio;

        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.play().catch(() => speakFallback());
        } else {
          speakFallback();
        }
      } catch (_) {
        speakFallback();
      }
    };

    const speakFallback = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.word);
        utterance.lang = 'en-US';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    };

    return (  
      <div className="word-details">
        <div className="word-header">
          <h2 className="word-title">{data.word}</h2>
          <div>
            <button
              className="audio-button"
              onClick={playAudio}
              aria-label="Play pronunciation"
              title="Play pronunciation"
            >
              <HiVolumeUp className="audio-icon" />
            </button>
            <button
              className="favorite-button"
              onClick={() => onFavorite(data.word)}
            >
              Add to Favorites
            </button>
          </div>
        </div>
  
        {data.phonetics?.[0]?.text && (
          <p className="phonetic-text">{data.phonetics[0].text}</p>
        )}
  
        {data.meanings?.map((meaning, i) => (
          <div key={i} className="meaning-section">
            <h3 className="part-of-speech">{meaning.partOfSpeech}</h3>
            <ul className="definitions-list">
              {meaning.definitions.slice(0, 2).map((def, j) => (
                <li key={j} className="definition-item">{def.definition}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
  