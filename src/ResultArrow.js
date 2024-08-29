// correct/incorrect arrow
function ResultArrow({correct}){
    if (correct){
        return <div className="pointer correct">Correct</div>
    } else {
        return <div className="pointer wrong">Incorrect</div>
    }
}

export default ResultArrow;