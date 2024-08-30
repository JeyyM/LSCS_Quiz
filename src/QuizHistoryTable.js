import React from 'react';

function QuizHistoryTable({ quizHistory, onAttemptClick }) {

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes} minutes`;
  };

  // find highest scorer
  const keptAttempt = quizHistory.reduce((max, attempt) =>
    attempt.score > max.score ? attempt : max,
    quizHistory[0]
  );

  // Reverse the history to display latest attempts first
  const reversedHistory = [...quizHistory].reverse();

  return (
    <div className="history-table">
      <table>
        <thead>
          <tr>
            <th className='thead'></th>
            <th className='thead'>Attempt</th>
            <th className='thead'>Time</th>
            <th className='thead'>Score</th>
          </tr>
        </thead>
        <tbody>
        {/* attempt click to change history */}
          {/* show kept first */}
          {keptAttempt && (
            <tr onClick={() => onAttemptClick(keptAttempt)}>
              <td className='tside'>KEPT</td>
              <td style={{textDecoration:"underline", color:"darkgreen"}}>Attempt {quizHistory.indexOf(keptAttempt) + 1}</td>
              <td>{formatTime(keptAttempt.totalTimeSeconds)}</td>
              <td>{keptAttempt.score} out of {keptAttempt.totalPoints}</td>
            </tr>
          )}
          {/* show all in opposite otder */}
          {reversedHistory.map((attempt, index) => (
            <tr key={index} onClick={() => onAttemptClick(attempt)}>
              <td className='tside'>
                {attempt === quizHistory[quizHistory.length - 1] ? 'LATEST' : ''}
              </td>
              <td style={{textDecoration:"underline", color:"darkgreen"}}>Attempt {quizHistory.length - index}</td>
              <td>{formatTime(attempt.totalTimeSeconds)}</td>
              <td>{attempt.score} out of {attempt.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuizHistoryTable;
