import './Favorites.css';
import { FaStar, FaTrashAlt } from 'react-icons/fa';

export default function Favorites({ favorites, onRemove, onSelect }) {
  if (favorites.length === 0) return null;

  return (
    <div className="favorites-container">
      <h3 className="favorites-title"><FaStar  /> Favorites</h3>
      <ul className="favorites-list">
        {favorites.map((word, i) => (
          <li key={i} className="favorite-item">
            <span
              className="favorite-word"
              onClick={() => onSelect(word)}
            >
              {word}
            </span>
            <button
              className="remove-button"
              onClick={(e) => {
                e.stopPropagation(); 
                onRemove(word);
              }}
              aria-label={`Remove ${word} from favorites`}
              title="Remove"
            >
              <FaTrashAlt />
            </button>

          </li>
        ))}
      </ul>
    </div>
  );
}
