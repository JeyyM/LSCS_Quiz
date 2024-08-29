import React from 'react';
import ResultArrow from './ResultArrow';

// for making the dummy question box  for the history items
function QuestionChecking({ question, selectedAnswer }) {
    return (
        <div className='question-container'>
            <div className='question-box'>
                <div className='question-label'>
                    <h2 className='question-font-1' style={{ marginRight: 'auto' }}>{question.question}</h2>
                    <h2 className='question-font-1'>
                        {/* if the answer gets full points or not */}
                        {selectedAnswer === question.correct_answer ? question.point_value : 0}/{question.point_value} pts
                    </h2>
                </div>

                <h2 className='question-font-2'>{question.question}</h2>

                {question.options.map((option, index) => {
                    // for putting the correct or incorrect arrow
                    const isCorrectOption = option === question.correct_answer;
                    const isSelectedOption = option === selectedAnswer;

                    return (
                        <div key={index} style={{ position: 'relative', marginBottom: '1rem' }}>
                            <hr style={{ width: '95%', margin: '1rem auto' }}></hr>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type='radio'
                                    id={`option-${index}`}
                                    name={`question-${question.question}`}
                                    value={option}
                                    checked={isSelectedOption}
                                    disabled
                                    className='question-radio'
                                />

                                {/* for putting correct and incorrect arrows */}
                                {isSelectedOption && !isCorrectOption && (
                                    <ResultArrow correct={false} />
                                )}
                                {isCorrectOption && (
                                    <ResultArrow correct={true} />
                                )}
                                <label htmlFor={`option-${index}`} className='question-font-2'>{option}</label>

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default QuestionChecking;