import { useReducer } from "react";

export default function Calculator() {
  /* 
  A calculadora tem os seguintes estados
  0 - Vazio 
  1 - Acumulando Digitos -> Operador
  2 - Recebendo Operador -> Digito
  3 - Acumulando Digitos (Pode voltar ao estado 2) -> Operador ou Igual
  4 - Mostrar o Resultado ou Erro
  */

  const initialState = {
    actualState: "AcumulatingDigitsFirst",
    digit: null,
    operator: null,
    displayEquation: [],
    acumulatedDigits: [],
    operationArray: [],
    showResult: false,
  };

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

  const reducer = (state, action) => {
    switch (action.actualState) {
      case "Clear": {
        //console.log(action.actualState);
        return initialState;
      }
      case "AcumulatingDigitsFirst": {
        //console.log(action.actualState);
        if (action.operator === "-" && action.acumulatedDigits.length === 0) {
          return {
            ...state,
            displayEquation: [...state.displayEquation.concat(action.operator)],
            acumulatedDigits: [
              ...state.acumulatedDigits.concat(action.operator),
            ],
            operator: null,
          };
        }
        if (action.digit !== null) {
          return {
            ...state,
            displayEquation: [...state.displayEquation.concat(action.digit)],
            acumulatedDigits: [...state.acumulatedDigits.concat(action.digit)],
            digit: null,
          };
        }
        if (action.operator !== null) {
          return {
            ...state,
            displayEquation: [...state.displayEquation.concat(action.operator)],
            operationArray: [state.acumulatedDigits.join("")].concat(
              action.operator
            ),
            acumulatedDigits: [],
            actualState: "ReceivingOperator",
            operator: action.operator,
          };
        }
        break;
      }
      case "ReceivingOperator": {
        //console.log(action.actualState);
        if (action.digit !== null) {
          return {
            ...state,
            displayEquation: [...state.displayEquation.concat(action.digit)],
            acumulatedDigits: [...state.acumulatedDigits.concat(action.digit)],
            digit: null,
            actualState: "AcumulatingDigitsSecond",
          };
        }
        if (action.operator !== null && action.operator !== "-") {
          const newDisplayEquation = [...state.displayEquation];
          newDisplayEquation[newDisplayEquation.length - 1] = action.operator;

          const newOperationArray = [...state.operationArray];
          newOperationArray[newOperationArray.length - 1] = action.operator;

          return {
            ...state,
            displayEquation: newDisplayEquation,
            operationArray: newOperationArray,
            operator: action.operator,
          };
        }
        if (action.operator === "-") {
          return {
            ...state,
            displayEquation: [...state.displayEquation.concat(action.operator)],
            acumulatedDigits: [
              ...state.acumulatedDigits.concat(action.operator),
            ],
            actualState: "AcumulatingDigitsSecond",
          };
        }

        break;
      }
      case "AcumulatingDigitsSecond": {
        //console.log(action.actualState);
        if (action.digit !== null) {
          return {
            ...state,
            displayEquation: [...state.displayEquation.concat(action.digit)],
            acumulatedDigits: [...state.acumulatedDigits.concat(action.digit)],
            digit: null,
          };
        }
        if (action.showResult === true) {
          const Result = Calculate(
            action.operationArray.concat(state.acumulatedDigits.join(""))
          );
          return {
            ...state,
            displayEquation: [].concat(Result),
            acumulatedDigits: [],
            operationArray: [].concat(Result),
            operator: null,
            actualState: "ShowingResult",
          };
        }
        if (action.operator !== null) {
          return {
            ...state,
            displayEquation: [...state.displayEquation.concat(action.operator)],
            operationArray: [
              ...state.operationArray.concat(state.acumulatedDigits.join("")),
              action.operator,
            ],
            acumulatedDigits: [],
            actualState: "ReceivingOperator",
            operator: action.operator,
          };
        }
        break;
      }
      case "ShowingResult": {
        //console.log(action.actualState);
        console.log(state);
        if (action.operator !== null) {
          return {
            ...state,
            displayEquation: [...state.displayEquation].concat(action.operator),
            operationArray: [...state.operationArray].concat(action.operator),
            acumulatedDigits: [],
            actualState: "ReceivingOperator",
            operator: action.operator,
          };
        }
        if (action.digit !== null) {
          return {
            ...state,
            actualState: "AcumulatingDigitsFirst",
            digit: null,
            operator: null,
            operationArray: [],
            showResult: false,
            displayEquation: [].concat(action.digit),
            acumulatedDigits: [].concat(action.digit),
          };
        }
        break;
      }
      case "ClearLast": {
        break;
      }
      default:
        return { ...state };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const enterDigit = (digitNumber) => {
    dispatch({ ...state, digit: digitNumber });
  };

  const enterOperation = (operation) => {
    dispatch({ ...state, operator: operation });
  };

  const enterResult = () => {
    dispatch({ ...state, showResult: true });
  };

  const clearAll = () => {
    dispatch({ ...state, actualState: "Clear" });
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
      </div>
    </>
  );
}
