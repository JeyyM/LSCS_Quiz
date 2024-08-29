import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Instructions from './Instructions';
import QuestionComponent from './QuestionComponent';

// page where the user answers
function QuestionPage() {
  // use id param in search to get to the correct question
  const { id } = useParams();
  const questionIndex = parseInt(id, 10) - 1;
  const navigate = useNavigate();

  // selected option
  const [selectedOption, setSelectedOption] = useState('');
  // questions in LS
  const [questions, setQuestions] = useState([]);
  // time keepers
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState({ minutes: 0, seconds: 0 });
  // the show time at sidebar
  const [isTimeVisible, setIsTimeVisible] = useState(true);

  // getting the data at the start
  useEffect(() => {
    const currentQuiz = JSON.parse(localStorage.getItem('current_quiz'));
    if (currentQuiz) {
      setQuestions(currentQuiz.shuffledQuestions || []);
      // to maintain the previous answers by matching the key
      setSelectedOption(currentQuiz[`question_${id}`] || '');
      setStartTime(new Date(currentQuiz.start_time));
    }
  }, [id]);

  // useEffect for the passed time
  useEffect(() => {
    if (startTime) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const difference = now - startTime;
        const minutes = Math.floor(difference / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);
        setElapsedTime({ minutes, seconds });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [startTime]);

  // select option change
  const handleOptionChange = (option) => {
    setSelectedOption(option);

    let currentQuiz = JSON.parse(localStorage.getItem('current_quiz')) || {};
    currentQuiz[`question_${id}`] = option;
    localStorage.setItem('current_quiz', JSON.stringify(currentQuiz));
  };

  // Marker clicker
  const handleMarkerClick = () => {
    let currentQuiz = JSON.parse(localStorage.getItem('current_quiz')) || {};
    const updatedQuestions = questions.map((q, index) => {
      if (index === questionIndex) {
        q.marked = !q.marked;
      }
      return q;
    });

    // setting to the version with the one edited marker
    currentQuiz.shuffledQuestions = updatedQuestions;
    localStorage.setItem('current_quiz', JSON.stringify(currentQuiz));
    setQuestions(updatedQuestions);
  };

  // To save the data to the LS
  const saveQuizHistory = () => {
    const currentQuiz = JSON.parse(localStorage.getItem('current_quiz'));
    
    // score summing
    const score = questions.reduce((total, q, index) => {
        return total + (q.correct_answer === currentQuiz[`question_${index + 1}`] ? q.point_value : 0);
    }, 0);

    const totalPoints = questions.reduce((total, q) => total + q.point_value, 0);

    const endTime = new Date();
    const totalTimeSeconds = Math.floor((endTime - startTime) / 1000);

    const quizHistory = {
        score: score,
        startDate: startTime.toISOString(),
        endDate: endTime.toISOString(),
        seed: currentQuiz.seed,
        totalTimeSeconds: totalTimeSeconds,
        totalQuestions: questions.length,
        totalPoints: totalPoints,
        questions: questions.map((q, index) => ({
            question: q.question,
            correctAnswer: q.correct_answer,
            userAnswer: currentQuiz[`question_${index + 1}`]
        }))
    };

    // Save to history at the end
    let history = JSON.parse(localStorage.getItem('quiz_history')) || [];
    history.push(quizHistory);
    localStorage.setItem('quiz_history', JSON.stringify(history));
};

  const handleNext = () => {
    let currentQuiz = JSON.parse(localStorage.getItem('current_quiz')) || {};
  
    if (questionIndex < questions.length - 1) {
      navigate(`/question/${questionIndex + 2}`);
    } else {
      // Check for unanswered
      const unansweredCount = questions.filter((question, index) => !currentQuiz[`question_${index + 1}`]).length;
  
      let confirmSubmit = true;
  
      // are you surer
      if (unansweredCount > 0) {
        confirmSubmit = window.confirm(
          `You have ${unansweredCount} unanswered questions. Are you sure you want to submit the quiz?`
        );
      }
  
      if (confirmSubmit) {
        // Calculate score, time, etc then save to LS
        saveQuizHistory();
  
        // Clear current_quiz from localStorage
        localStorage.removeItem('current_quiz');
  
        navigate('/'); // Redirect after submission
      }
    }
  };

  // go back 1 index
  const handlePrevious = () => {
    if (questionIndex > 0) {
      navigate(`/question/${questionIndex}`);
    }
  };

  const toggleTimeVisibility = () => {
    setIsTimeVisible(!isTimeVisible);
  };

  if (questions.length === 0) return <div>Loading...</div>;

  return (
    <main className="content" style={{ paddingLeft: "8.5rem" }}>
      <Header></Header>

      <div className="container">
        <div className="question-menu">
          <h1 className='quiz-title' style={{ margin: "2rem 0" }}>Animals Quiz</h1>
          <h2 className='instruction-font'>
            Started on {new Date(startTime).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }).replace(',', ' at')}
          </h2>
          <Instructions />

          <hr style={{ margin: "1rem 0" }} />

          <QuestionComponent
            questionIndex={questionIndex}
            question={questions[questionIndex]}
            selectedOption={selectedOption}
            handleOptionChange={handleOptionChange}
            handleMarkerClick={handleMarkerClick}
            id={id}
            checking={false}
          />
          
          <div className='next-buttons'>
            <button className='next' onClick={handlePrevious} disabled={questionIndex === 0}>Previous</button>
            <button className={questionIndex === questions.length - 1 ? 'take-quiz-button' : 'next'} onClick={handleNext}>
              {questionIndex === questions.length - 1 ? "Submit Quiz" : "Next"}
            </button>
          </div>
        </div>

        <div className="quiz-sidebar">
          <h3 className='detail-font detail-bold'>Questions</h3>
          {questions.map((question, index) => (
            <div
              key={index}
              className='questions-side'
              onClick={() => navigate(`/question/${index + 1}`)}
            >

            {/* reflect mark */}
              <div
                className='questions-nav'
                style={{
                  background: question.marked ? 'orangered' : 'rgb(39, 39, 39)',
                }}
              >&nbsp;</div>
              <h3 className='q-side-font'>Question {index + 1}</h3>
            </div>
          ))}
          <h3 className='q-side-font'>
            Time Elapsed: <span className='hide-time' onClick={toggleTimeVisibility}>{isTimeVisible ? 'Hide' : 'Show'}</span>
          </h3>
          {isTimeVisible && (
            <h3 className='q-side-font'>{elapsedTime.minutes} minutes {elapsedTime.seconds} seconds</h3>
          )}
        </div>
      </div>
    </main>
  );
}

export default QuestionPage;
