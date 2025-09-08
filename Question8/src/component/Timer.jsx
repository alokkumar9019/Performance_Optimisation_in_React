import React from 'react'
import useTimer from '../Hooks/useTimer';

const Timer = () => {
    const {timer,isRunnning,startTimer,stopTimer,resetTimer}=useTimer();
  return (
    <div>
        <h1>Timer:{timer}</h1>
        <p>{isRunnning ? "Running":"Stopped"}</p>
        <button onClick={startTimer}>Start</button>
        <button onClick={stopTimer}>Stop</button>
        <button onClick={resetTimer}>Reset</button>
    </div>
  )
}

export default Timer