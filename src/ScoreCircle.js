import React, { useState, useEffect } from 'react';

// the out of circle
function ScoreCircle({ score, total }) {
  // for the ratio
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const targetPercentage = (score / total) * 100;

  // to animate the damn thing, i barely know how this works
  useEffect(() => {
    const animationDuration = 1500;
    const steps = 60;
    const increment = targetPercentage / steps;
    let currentPercentage = 0;

    const timer = setInterval(() => {
      currentPercentage += increment;
      if (currentPercentage >= targetPercentage) {
        clearInterval(timer);
        setAnimatedPercentage(targetPercentage);
      } else {
        setAnimatedPercentage(currentPercentage);
      }
    }, animationDuration / steps);

    return () => clearInterval(timer);
  }, [score, total, targetPercentage]);

  // conic gradient since its a circle
  const gradientStyle = {
    background: `conic-gradient(cornflowerblue ${animatedPercentage}%, rgb(169, 169, 169) ${animatedPercentage}%)`
  };

  return (
    <div className='percent-container'>
      <div className='bg-color'>
        <div className='fill-color' style={gradientStyle}>
          <div className='center-color'>
            <h2 className='point-result'>{score}</h2>
            <h3 className='detail-font'>Points</h3>
          </div>
        </div>
      </div>
      <h3 className='detail-font'>Out of {total}</h3>
    </div>
  );
}

export default ScoreCircle;