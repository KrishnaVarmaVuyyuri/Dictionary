import { useEffect, useState } from 'react';
import './Home.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import WordDetails from '../../components/WordDetails/WordDetails';
import Favorites from '../../components/Favorites/Favorites';
import Translator from '../../components/Translator/Translator';
import { FaTimes } from 'react-icons/fa';
import dictPic from '../../assets/dictionary-pic.png';
import transPic from '../../assets/translator-pic.png'
import Quiz from '../../components/Quiz/Quiz';
// Add your translator image import here
// import translatorPic from '../../assets/translator-pic.png';

export default function Home() {
  const [showDictionary, setShowDictionary] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [wordData, setWordData] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!searchWord) {
      return;
    }
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
      .then((res) => res.json())
      .then((data) => setWordData(data[0]))
      .catch((err) => console.error(err));
  }, [searchWord]);

  const handleSelectWord = (word) => {
    setWordData(null);
    setSearchWord(word);
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (word) => {
    if (!favorites.includes(word)) {
      setFavorites([...favorites, word]);
    }
  };

  const removeFavorite = (word) => {
    setFavorites((prev) => prev.filter((fav) => fav !== word));
  };

  return (
    <div className="home-container">
      {/* Dictionary Section */}
      <div className={`div1 ${showDictionary ? 'dict-open' : ''}`}>
        {!showDictionary ? (
          <>
            <div className='dict-title-section'>
              <div className='dict-title'>
                Dictionary
              </div>
            </div>
            <div className="welcome-section">

              <img src={dictPic} className='dictPic' alt="Dictionary" />

              {/* <div className="dict-quote">
              Where words meet understanding.
            </div> */}

              <button
                className='dict-open-btn'
                onClick={() => setShowDictionary(true)}
              >
                Open Dictionary
              </button>
            </div>
          </>
        ) : (
          <div className="dictionary-wrapper">
            <button
              className="close-btn"
              onClick={() => setShowDictionary(false)}
              aria-label="Close dictionary"
              title="Close"
            >
              <FaTimes />
            </button>
            <div className="dict-content">
              <SearchBar onSearch={setSearchWord} />
              {wordData && (
                <WordDetails
                  data={wordData}
                  onFavorite={addFavorite}
                  inputWord={searchWord}
                />
              )}
              <Favorites favorites={favorites} onRemove={removeFavorite} onSelect={handleSelectWord} />
            </div>
          </div>

        )}
      </div>

      {/* Translator Section */}
      <div className={`div2 ${!showTranslate ? 'with-background' : ''}`}>
        {!showTranslate ? (<>
          <div className='trans-title-section'>
            <div className='trans-title'>
              Translator
            </div>
          </div>
          <div className="translator-welcome-section">
            {/* Replace this div with your actual translator image */}
            <img src={transPic} className='translatorPic' alt="Translator" />

            {/* Uncomment this when you have the translator image */}

            {/* <div className="translator-quote">
        Breaking language barriers effortlessly.
      </div> */}

            <button
              className='translator-open-btn'
              onClick={() => setShowTranslate(true)}
            >
              Open Translator
            </button>
          </div>
        </>

        ) : (
          <div className="translator-wrapper">
            <button
              className="close-btn"
              onClick={() => setShowTranslate(false)}
              aria-label="Close translator"
              title="Close"
            >
              <FaTimes />
            </button>
            <div className="translator-content">
              <Translator />
            </div>
          </div>
        )}
      </div>

      {/* Third Section - You can add content here later */}
      <div className={`div3 ${!showQuiz ? 'with-background' : ''}`}>
        {!showQuiz ? (<>
          <div className='quiz-title-section'>
            <div className='quiz-title'>
              Quiz
            </div>
          </div>
          <div className="quiz-welcome-section">

            <img src={transPic} className='translatorPic' alt="Quiz" />

            <button
              className='quiz-open-btn'
              onClick={() => setShowQuiz(true)}
            >
              Open Quiz
            </button>
          </div>
        </>

        ) : (
          <div className="quiz-wrapper">
            <button
              className="close-btn"
              onClick={() => setShowQuiz(false)}
              aria-label="Close Quiz"
              title="Close"
            >
              <FaTimes />
            </button>
            <div className="quiz-content">
              <Quiz />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}