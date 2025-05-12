import React, { useState, useEffect, useRef } from 'react'

const App = () => {
  const [breakLength, setBreakLength] = useState(5)
  const [sessionLength, setSessionLength] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isSession, setIsSession] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 0) {
            const newTime = isSession ? breakLength * 60 : sessionLength * 60
            setIsSession(!isSession)
            return newTime
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, isSession, breakLength, sessionLength])

  const handleReset = () => {
    clearInterval(intervalRef.current)
    setBreakLength(5)
    setSessionLength(25)
    setTimeLeft(25 * 60)
    setIsRunning(false)
    setIsSession(true)
    const beep = document.getElementById("beep")
    if (beep) {
      beep.pause()
      beep.currentTime = 0
    }
  }

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  useEffect(() => {
    if (timeLeft === 0) {
      const beep = document.getElementById("beep")
      if (beep) beep.play()
    }
  }, [timeLeft])

  return (
    <div className="container">
      <h1>25 + 5 Clock</h1>

      <div className="length-controls">
        <div>
          <h3 id="break-label">Break Length</h3>
          <button id="break-decrement" onClick={() => !isRunning && setBreakLength(b => Math.max(1, b - 1))}>-</button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={() => !isRunning && setBreakLength(b => b + 1)}>+</button>
        </div>

        <div>
          <h3 id="session-label">Session Length</h3>
          <button id="session-decrement" onClick={() => {
            if (!isRunning) {
              setSessionLength(s => Math.max(1, s - 1))
              setTimeLeft(t => Math.max(60, (sessionLength - 1) * 60))
            }
          }}>-</button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={() => {
            if (!isRunning) {
              setSessionLength(s => s + 1)
              setTimeLeft(t => (sessionLength + 1) * 60)
            }
          }}>+</button>
        </div>
      </div>

      <div className="timer">
        <h2 id="timer-label">{isSession ? 'Session' : 'Break'}</h2>
        <h1 id="time-left">{formatTime()}</h1>
        <audio id="beep" preload="auto" src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" />
      </div>

      <div id="controls">
        <button id="start_stop" onClick={() => setIsRunning(r => !r)}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>
    </div>
  )
}

export default App
