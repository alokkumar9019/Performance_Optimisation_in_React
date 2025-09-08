import { useReducer, useRef, useEffect } from "react";

function useTimer() {
  const intervalRef = useRef(null);

  function reducer(state, action) {
    switch (action.type) {
      case "START":
        return { ...state, isRunning: true };
      case "STOP":
        return { ...state, isRunning: false };
      case "RESET":
        return { timer: 0, isRunning: false };
      case "TICK":
        return { ...state, timer: state.timer + 1 };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    timer: 0,
    isRunning: false,
  });

  const startTimer = () => {
    if (!state.isRunning) {
      dispatch({ type: "START" });
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      dispatch({ type: "STOP" });
    }
  };

  const resetTimer = () => {
    stopTimer();
    dispatch({ type: "RESET" });
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return {
    timer: state.timer,
    isRunning: state.isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  };
}

export default useTimer;
