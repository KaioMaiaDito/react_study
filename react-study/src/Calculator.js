import { useReducer, useState } from "react";

export default function Calculator() {
  const initialState = {
    digit: null,
    acumulatedDigits: [],
    displayEquation: [],
    operationArray: [],
  };

  const [error, setError] = useState(false);

  const Calculate = (operationArray) => {
    return operationArray.reduce((acc, current, i, array) => {
      switch (current) {
        case "+":
          return Number(acc) + Number(array[i + 1]);
        case "-":
          return Number(acc) - Number(array[i + 1]);
        case "*":
          return Number(acc) * Number(array[i + 1]);
        case "/":
          return Number(array[i + 1]) !== 0
            ? Number(acc) / Number(array[i + 1])
            : "Error";
        default:
          return acc ?? current;
      }
    }, null);
  };

  const reducer = (state, condition) => {
    switch (condition.action) {
      case "calculator/CLEAR_ALL": {
        setError(false);
        return initialState;
      }
      case "calculator/INSERT_DIGIT": {
        setError(false);
        return {
          ...state,
          displayEquation: [
            ...state.displayEquation.concat(condition.payload.digit),
          ],
          acumulatedDigits: [
            ...state.acumulatedDigits.concat(condition.payload.digit),
          ],
        };
      }
      case "calculator/FLUSH_DIGITS": {
        if (
          state.acumulatedDigits.length > 0 &&
          state.acumulatedDigits !== "-"
        ) {
          return {
            ...state,
            operationArray: [
              ...state.operationArray.concat(state.acumulatedDigits.join("")),
            ],
            acumulatedDigits: [],
          };
        }
        return { ...state };
      }
      case "calculator/UPSERT_OPERATOR": {
        if (
          state.operationArray.length === 0 &&
          state.acumulatedDigits.length === 0
        ) {
          return {
            ...state,
            displayEquation: [
              ...state.displayEquation.concat(condition.payload.digit),
            ],
            acumulatedDigits: [
              ...state.acumulatedDigits.concat(condition.payload.digit),
            ],
            digit: null,
          };
        } else if (
          Number.isInteger(
            +state.operationArray[state.operationArray.length - 1]
          )
        ) {
          return {
            ...state,
            displayEquation: [
              ...state.displayEquation.concat(condition.payload.digit),
            ],
            operationArray: [
              ...state.operationArray.concat(condition.payload.digit),
            ],
          };
        } else if (
          state.operationArray[state.operationArray.length - 1] !== "+" &&
          state.operationArray[state.operationArray.length - 1] !== "-" &&
          condition.payload.digit === "-"
        ) {
          return {
            ...state,
            displayEquation: [
              ...state.displayEquation.concat(condition.payload.digit),
            ],
            acumulatedDigits: [
              ...state.acumulatedDigits.concat(condition.payload.digit),
            ],
          };
        } else if (state.operationArray.length > 1) {
          const newOperationArray = [...state.operationArray];
          newOperationArray[newOperationArray.length - 1] =
            condition.payload.digit;
          const newDisplayEquation = [...state.displayEquation];
          newDisplayEquation[newDisplayEquation.length - 1] =
            condition.payload.digit;
          return {
            ...state,
            displayEquation: newDisplayEquation,
            operationArray: newOperationArray,
          };
        }
        return { ...state };
      }
      case "calculator/SUBMIT": {
        const Result = Calculate(state.operationArray);
        if (Result !== "Error") {
          return {
            ...state,
            acumulatedDigits: Result.toString().split("").map(Number),
            operationArray: [],
            displayEquation: Result.toString().split(""),
          };
        }
        setError(true);
        return initialState;
      }
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const enterDigit = (digitNumber) => {
    dispatch({
      action: "calculator/INSERT_DIGIT",
      payload: {
        digit: digitNumber,
      },
    });
  };

  const enterOperation = (operation) => {
    dispatch({
      action: "calculator/FLUSH_DIGITS",
      payload: {},
    });

    dispatch({
      action: "calculator/UPSERT_OPERATOR",
      payload: {
        digit: operation,
      },
    });
  };

  const enterResult = () => {
    dispatch({
      action: "calculator/FLUSH_DIGITS",
      payload: {},
    });
    dispatch({
      action: "calculator/SUBMIT",
      payload: {},
    });
  };

  const clearAll = () => {
    dispatch({
      action: "calculator/CLEAR_ALL",
      payload: {},
    });
  };

  return (
    <>
      <div>
        <p>{state.displayEquation}</p>
        <div>
          <button onClick={() => clearAll()}>Clear</button>
          <button onClick={() => enterOperation("/")}>/</button>
        </div>
        <div>
          <button onClick={() => enterDigit(1)}>1</button>
          <button onClick={() => enterDigit(2)}>2</button>
          <button onClick={() => enterDigit(3)}>3</button>
          <button onClick={() => enterOperation("+")}>+</button>
        </div>
        <div>
          <button onClick={() => enterDigit(4)}>4</button>
          <button onClick={() => enterDigit(5)}>5</button>
          <button onClick={() => enterDigit(6)}>6</button>
          <button onClick={() => enterOperation("-")}>-</button>
        </div>
        <div>
          <button onClick={() => enterDigit(7)}>7</button>
          <button onClick={() => enterDigit(8)}>8</button>
          <button onClick={() => enterDigit(9)}>9</button>
          <button onClick={() => enterOperation("*")}>*</button>
        </div>
        <div>
          <button onClick={() => enterDigit(0)}>0</button>
          <button onClick={() => enterResult()}>=</button>
        </div>
        {error === true ? <h3>ERROR</h3> : <></>}
      </div>
    </>
  );
}
