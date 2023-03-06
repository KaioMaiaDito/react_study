import { useState } from "react";

export default function Counter() {
  const [counterNumber, setCounterNumber] = useState(0);

  function ResetCounter() {
    setCounterNumber(0);
  }
  function IncrementCounter() {
    setCounterNumber((prevCounterNumber) => prevCounterNumber + 1);
  }
  function DecrementCounter() {
    setCounterNumber((prevCounterNumber) => prevCounterNumber - 1);
  }
  return (
    <>
      <div>
        <h1>{counterNumber}</h1>
        <button className="button" onClick={DecrementCounter}>
          -
        </button>
        <button className="button" onClick={ResetCounter}>
          Reset
        </button>
        <button className="button" onClick={IncrementCounter}>
          +
        </button>
      </div>
    </>
  );
}
