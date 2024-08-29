import React from 'react';

// for the box where answers are selected at
function QuestionComponent({
  questionIndex,
  question,
  selectedOption,
  handleOptionChange,
  handleMarkerClick,
  id
}) {
  return (
    <div className='question-container'>
    {/* the pointer is for the question marker, triggers to change the state to marked */}
      <div
        className={`pointer ${question.marked ? 'marked' : ''}`}
        onClick={handleMarkerClick}
      ></div>
      <div className='question-box'>
        <div className='question-label'>
          <h2 className='question-font-1' style={{ marginRight: "auto" }}>
            Question {questionIndex + 1} of 10
          </h2>
          <h2 className='question-font-1'>{question.point_value} pts</h2>
        </div>

        <h2 className='question-font-2'>{question.question}</h2>

        {question.options.map((option, index) => (
          <div key={index}>
            <hr style={{ width: "95%", margin: "1rem auto" }}></hr>
            <input
              type="radio"
              id={`option-${index}`}
              name={`question-${id}`}
              value={option}
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
              className='question-radio'
            />
            <label htmlFor={`option-${index}`} className='question-font-2'>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionComponent;
