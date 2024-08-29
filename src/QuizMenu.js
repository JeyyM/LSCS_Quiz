import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Instructions from './Instructions'; // Reused instructions in menu and question page
import ScoreCircle from './ScoreCircle'; // Shows the X/10 Result
import QuizHistoryTable from './QuizHistoryTable'; // For the attempt history
import QuestionChecking from './QuestionChecking'; // Dummy questions that shows if the user is right or wrong

function QuizMenu() {
  const navigate = useNavigate();
  const [isQuizInProgress, setIsQuizInProgress] = useState(false); // to show Take the Quiz or Resume Quiz
  // For the sidebar 
  const [latestTime, setLatestTime] = useState('N/A');
  const [latestScore, setLatestScore] = useState('N/A');
  const [keptScore, setKeptScore] = useState('N/A');
  // For the past attempts in local storage
  const [quizHistory, setQuizHistory] = useState([]);
  // The attempt currently being viewed
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  // The questions are randomized with a seed, used to get the randomized one answered
  // since this is likely more efficient instead of overloading the local storage
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Memoize questions since warnings are yelling at me
  const questions = useMemo(() => [
    {
      "question": "What is the largest land animal?",
      "options": ["Elephant", "Giraffe", "Hippopotamus", "Rhinoceros"],
      "correct_answer": "Elephant",
      "point_value": 1,
      "marked": false
    },
    {
      "question": "Which of these animals is a marsupial?",
      "options": ["Kangaroo", "Elephant", "Lion", "Crocodile"],
      "correct_answer": "Kangaroo",
      "point_value": 2,
      "marked": false
    },
    {
      "question": "What is the fastest land animal?",
      "options": ["Cheetah", "Lion", "Horse", "Eagle"],
      "correct_answer": "Cheetah",
      "point_value": 1,
      "marked": false
    },
    {
      "question": "Which animal is known as the 'King of the Jungle'?",
      "options": ["Lion", "Tiger", "Bear", "Elephant"],
      "correct_answer": "Lion",
      "point_value": 1,
      "marked": false
    },
    {
      "question": "Which bird is known for its colorful feathers and ability to mimic sounds?",
      "options": ["Parrot", "Eagle", "Penguin", "Owl"],
      "correct_answer": "Parrot",
      "point_value": 1,
      "marked": false
    },
    {
      "question": "What is the largest species of shark?",
      "options": ["Great White Shark", "Hammerhead Shark", "Whale Shark", "Tiger Shark"],
      "correct_answer": "Whale Shark",
      "point_value": 2,
      "marked": false
    },
    {
      "question": "Which animal is known to have a prehensile tail?",
      "options": ["Monkey", "Elephant", "Zebra", "Dog"],
      "correct_answer": "Monkey",
      "point_value": 1,
      "marked": false
    },
    {
      "question": "What is the primary diet of a panda?",
      "options": ["Bamboo", "Fish", "Insects", "Fruits"],
      "correct_answer": "Bamboo",
      "point_value": 2,
      "marked": false
    },
    {
      "question": "Which animal is known for its ability to change colors?",
      "options": ["Chameleon", "Frog", "Snake", "Turtle"],
      "correct_answer": "Chameleon",
      "point_value": 2,
      "marked": false
    },
    {
      "question": "Which animal is the tallest in the world?",
      "options": ["Giraffe", "Elephant", "Kangaroo", "Polar Bear"],
      "correct_answer": "Giraffe",
      "point_value": 2,
      "marked": false
    }
  ], []);

  // some seed generator
  const seededRandom = (seed) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // to recreate randomized questions
  // Was giving an error saying to useCallback to memoize
  const shuffleQuestions = useCallback((questions, seed) => {
    // shallow copy to not ruin original arrays
    const newSet = [...questions];

    for (let i = newSet.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed) * (i + 1));
      [newSet[i], newSet[j]] = [newSet[j], newSet[i]];
      seed++;
    }
    return newSet;
  }, []);

  // to maintain the progress on a current quiz
  useEffect(() => {
    const currentQuiz = JSON.parse(localStorage.getItem('current_quiz'));
    // if a quiz exists
    if (currentQuiz && Object.keys(currentQuiz).length > 0) {
      setIsQuizInProgress(true);
    }

    // to get quiz history or return blank
    const storedHistory = JSON.parse(localStorage.getItem('quiz_history')) || [];
    // the array does have content
    if (storedHistory.length > 0) {
      const latestAttempt = storedHistory[storedHistory.length - 1];
      // set sidebar data
      setLatestTime(formatTime(latestAttempt.totalTimeSeconds));
      setLatestScore(latestAttempt.score);
      // sets the attempt where the mistakes are
      setSelectedAttempt(latestAttempt);

      // .map to get array of just scores, then use max to get it
      const highestScore = Math.max(...storedHistory.map(attempt => attempt.score));
      setKeptScore(highestScore);

      // setting the history since if theres none, it shouldnt be set
      setQuizHistory(storedHistory);
    }
  }, []);

  // The recreation of the randomization of the questions for the reviewing of attempts
  useEffect(() => {
    if (selectedAttempt) {
      const shuffledResult = shuffleQuestions(questions, selectedAttempt.seed);
      setShuffledQuestions(shuffledResult);
    }
  }, [selectedAttempt, questions, shuffleQuestions]);

  // to change the attempt selected
  const handleAttemptClick = (attempt) => {
    setSelectedAttempt(attempt);
  };

  // for the seed when setting the randomized questions for the start of the quiz
  const generateSeed = () => Math.floor(Math.random() * 1000000);

  // sets the local storage data
  const startQuiz = () => {
    let currentQuiz = JSON.parse(localStorage.getItem('current_quiz')) || {};

    // no quiz to resume, sets up the data into LS
    if (!currentQuiz.seed) {
      currentQuiz.seed = generateSeed();
      currentQuiz.shuffledQuestions = shuffleQuestions(questions, currentQuiz.seed);
      currentQuiz.start_time = new Date().toISOString();
      localStorage.setItem('current_quiz', JSON.stringify(currentQuiz));
    }
    navigate('/question/1');
  };

  // resetting all data and all local storage items
  const resetQuiz = () => {
    localStorage.removeItem('current_quiz');
    localStorage.removeItem('quiz_history');
    setIsQuizInProgress(false);
    setLatestTime('N/A');
    setLatestScore('N/A');
    setKeptScore('N/A');
    setSelectedAttempt(null);
    setShuffledQuestions([]);
    window.location.reload();
  };

  // time formatter to match Canvas's
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} minutes ${seconds} seconds`;
  };

  let totalPoints = questions.reduce((sum, question) => sum + question.point_value, 0);
  let quizSize = questions.length;

  return (
    <main className="content" style={{ paddingLeft: '8.5rem' }}>
      <header className='header'>
        <div className='header-menu'>&nbsp;</div>
        <h2 className='header-font-1 header-link'>ANML101A - S12</h2>
        <div className='header-chevron'>&nbsp;</div>
        <h2 className='header-font-1 header-link'>Quizzes</h2>
        <div className='header-chevron'>&nbsp;</div>
        <h2 className='header-font-1'>Animals Quiz</h2>
      </header>
      <hr />

      <div className="container">
        <div className="quiz-menu">
          <h1 className='quiz-title'>Animals Quiz</h1>
          <hr style={{ marginTop: '1.2rem' }} />

          <div className='detail-display'>
            <h3 className='detail-font'><span className='detail-bold'>Due</span> Jul 4 at 12:40pm</h3>
            <h3 className='detail-font'><span className='detail-bold'>Points</span> {totalPoints}</h3>
            <h3 className='detail-font'><span className='detail-bold'>Questions</span> {quizSize}</h3>
            <h3 className='detail-font'><span className='detail-bold'>Available</span> Jul 4 at 11:05am - Jul 4 at 12:40pm <span className='detail-time'>1 hour and 35 minutes</span></h3>
            <h3 className='detail-font'><span className='detail-bold'>Time Limit</span> No Time Limit</h3>
          </div>

          <hr />

          <Instructions />

          {/* the score circle to show X/15 points */}
          {latestScore !== 'N/A' && (
            <ScoreCircle score={selectedAttempt.score} total={totalPoints} />
          )}

          <div className='button-container'>
            <button className='take-quiz-button' onClick={startQuiz}>
              {isQuizInProgress ? 'Resume Quiz' : 'Take the Quiz'}
            </button>
            <button className='reset-quiz-button' onClick={resetQuiz}>Reset Data</button>
          </div>

          {/* only show if there are previous attempt */}
          {latestScore !== 'N/A' && (
            <>
              <h2 className='attempt-heading'>Attempt History</h2>
              <QuizHistoryTable
                quizHistory={quizHistory}
                onAttemptClick={handleAttemptClick}
              />
            </>
          )}

          {latestScore !== 'N/A' && (
            <>
              <hr style={{ margin: "2rem 0" }}></hr>
              <div className='question-review'>

                <div className="attempt-detail-container">
                  <h2 className="attempt-details">Score for this attempt: <span style={{ fontWeight: "700", fontSize: "2rem" }}>{selectedAttempt.score}</span> out of {quizSize}</h2>
                  <h3 className="attempt-details">
                    Submitted {new Date(selectedAttempt.endDate).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    }).replace(',', ' at')}
                  </h3>
                  <h3 className="attempt-details">
                    This attempt took {Math.floor(selectedAttempt.totalTimeSeconds / 60)} minutes.
                  </h3>
                </div>

                {/* showing the history, will shuffle to match since it changes to match the seed */}
                {shuffledQuestions.map((question, index) => (
                  <QuestionChecking
                    key={index}
                    question={question}
                    selectedAnswer={selectedAttempt.questions[index].userAnswer}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="quiz-sidebar">
          <h3 className='detail-font detail-bold'>Submission Details:</h3>
          <hr />
          <div className='submission-divide'>
            <h3 className='submission-font detail-bold submission-width'>Time:</h3>
            <h3 className='detail-font'>{selectedAttempt ? formatTime(selectedAttempt.totalTimeSeconds) : latestTime}</h3>
          </div>
          <hr />

          <div className='submission-divide'>
            <h3 className='submission-font detail-bold submission-width'>Current Score:</h3>
            <h3 className='detail-font'>{selectedAttempt ? selectedAttempt.score : latestScore} out of {totalPoints}</h3>
          </div>
          <hr />

          <div className='submission-divide'>
            <h3 className='submission-font detail-bold submission-width'>Kept Score:</h3>
            <h3 className='detail-font'>{keptScore} out of {totalPoints}</h3>
          </div>
          <hr />
        </div>
      </div>
    </main>
  );
}

export default QuizMenu;
