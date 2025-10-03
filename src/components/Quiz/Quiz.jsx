import { useEffect, useState } from "react";
import wordBank from "../../data/wordBank.json";
import './Quiz.css';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    // pick 5 random words
    const randomWords = shuffle(wordBank).slice(0, 5);

    const generated = randomWords.map((item) => {
      const isSynonym = Math.random() > 0.5; // randomly ask synonym or antonym
      let correct, options;

      if (isSynonym && item.synonyms.length > 0) {
        correct = item.synonyms[0];
        options = shuffle([
          correct,
          ...item.synonyms.slice(1, 2), // 1 more synonym if available
          ...item.antonyms.slice(0, 2)   // 2 antonyms as distractors
        ]).slice(0, 4);
      } else if (item.antonyms.length > 0) {
        correct = item.antonyms[0];
        options = shuffle([
          correct,
          ...item.antonyms.slice(1, 2),
          ...item.synonyms.slice(0, 2)
        ]).slice(0, 4);
      } else {
        // fallback to synonyms
        correct = item.synonyms[0];
        options = shuffle([correct, ...item.synonyms.slice(1), ...item.antonyms]).slice(0, 4);
      }

      return {
        type: isSynonym ? "synonym" : "antonym",
        word: item.word,
        correct,
        options
      };
    });

    setQuestions(generated);
  }, []);

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setShowResult(true);
    
    if (option === questions[current].correct) {
      setScore((s) => s + 1);
    }

    // Move to next question after 1.5 seconds
    setTimeout(() => {
      setCurrent((c) => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }, 1500);
  };

  const getButtonClass = (option) => {
    if (!showResult) return 'quiz-btn';
    
    if (option === questions[current].correct) {
      return 'quiz-btn correct';
    }
    
    if (option === selectedAnswer && option !== questions[current].correct) {
      return 'quiz-btn wrong';
    }
    
    return 'quiz-btn disabled';
  };

  const resetQuiz = () => {
    setCurrent(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    
    // Generate new questions
    const randomWords = shuffle(wordBank).slice(0, 5);
    const generated = randomWords.map((item) => {
      const isSynonym = Math.random() > 0.5;
      let correct, options;

      if (isSynonym && item.synonyms.length > 0) {
        correct = item.synonyms[0];
        options = shuffle([
          correct,
          ...item.synonyms.slice(1, 2),
          ...item.antonyms.slice(0, 2)
        ]).slice(0, 4);
      } else if (item.antonyms.length > 0) {
        correct = item.antonyms[0];
        options = shuffle([
          correct,
          ...item.antonyms.slice(1, 2),
          ...item.synonyms.slice(0, 2)
        ]).slice(0, 4);
      } else {
        correct = item.synonyms[0];
        options = shuffle([correct, ...item.synonyms.slice(1), ...item.antonyms]).slice(0, 4);
      }

      return {
        type: isSynonym ? "synonym" : "antonym",
        word: item.word,
        correct,
        options
      };
    });

    setQuestions(generated);
  };

  if (current >= questions.length) {
    return (
      <div className="quiz-container">
        <h2>Quiz Over!</h2><h2> Score: {score}/{questions.length}</h2>
        <button className="quiz-restart-btn" onClick={resetQuiz}>
          Start New Quiz
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="quiz-container">
      <h3>
        Q{current + 1}: Choose a {q.type} of "<strong>{q.word}</strong>"
      </h3>
      <div className="options">
        {q.options.map((opt, i) => (
          <button 
            key={i} 
            className={getButtonClass(opt)} 
            onClick={() => handleAnswer(opt)}
            disabled={showResult}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Quiz;