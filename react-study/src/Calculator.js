import { useReducer, useState } from "react";
import styled from "styled-components";

export default function Calculator() {
  const initialState = {
    acumulatedDigits: [],
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
    const { action, payload } = condition;
    const lastOperation = state.operationArray[state.operationArray.length - 1];
    const lastDigit = state.acumulatedDigits[state.acumulatedDigits.length - 1];

    switch (action) {
      case "calculator/CLEAR_ALL": {
        setError(false);
        return initialState;
      }
      case "calculator/INSERT_DIGIT": {
        setError(false);
        return {
          ...state,
          acumulatedDigits: [...state.acumulatedDigits, payload.digit],
        };
      }
      case "calculator/FLUSH_DIGITS": {
        if (
          state.acumulatedDigits.length > 0 &&
          state.acumulatedDigits.join("") !== "-"
        ) {
          return {
            ...state,
            acumulatedDigits: [],
            operationArray: [
              ...state.operationArray,
              state.acumulatedDigits.join(""),
            ],
          };
        }
        return { ...state };
      }
      case "calculator/UPSERT_OPERATOR": {
        // * if isNumber(pilha[-1]) INSERT operations
        // * else pilha[-1] !== '+' && payload.operator === '-' INSERT digits
        // * else UPDATE operations
        if (isNumber(lastOperation)) {
          // inserir o operador em operations
          return {
            ...state,
            operationArray: [...state.operationArray, payload.operator],
          };
        } else if (
          !["-"].includes(lastOperation) &&
          !["-"].includes(lastDigit) &&
          payload.operator === "-"
        ) {
          // inserir o menos no digits
          return {
            ...state,
            acumulatedDigits: [...state.acumulatedDigits, payload.operator],
          };
        } else {
          // substituir o ultimo operador no operations
          return {
            ...state,
            acumulatedDigits: [],
            operationArray: [
              ...state.operationArray.slice(0, state.operationArray.length - 1),
              payload.operator,
            ],
          };
        }

        // if (
        //   state.operationArray.length === 0 &&
        //   state.acumulatedDigits.length === 0 &&
        //   payload.operator === "-"
        // ) {
        //   return {
        //     ...state,
        //     acumulatedDigits: [...state.acumulatedDigits, payload.operator],
        //   };
        // } else if (
        //   !isNaN(
        //     parseInt(state.operationArray[state.operationArray.length - 1])
        //   )
        // ) {
        //   return {
        //     ...state,
        //     operationArray: [...state.operationArray, payload.operator],
        //   };
        // } else if (
        //   state.operationArray[state.operationArray.length - 1] !== "+" &&
        //   state.operationArray[state.operationArray.length - 1] !== "-" &&
        //   payload.operator === "-"
        // ) {
        //   return {
        //     ...state,
        //     acumulatedDigits: [
        //       ...state.acumulatedDigits.concat(payload.operator),
        //     ],
        //   };
        // } else if (state.operationArray.length > 1) {
        //   const newOperationArray = [...state.operationArray];
        //   newOperationArray[newOperationArray.length - 1] = payload.operator;

        //   return {
        //     ...state,
        //     operationArray: newOperationArray,
        //   };
        // }
        // return { ...state };
      }
      case "calculator/SUBMIT": {
        const Result = Calculate(state.operationArray);
        if (Result !== "Error") {
          return {
            ...state,
            acumulatedDigits: [Result],
            operationArray: [],
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
        operator: operation,
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

  const lastOperation = state.operationArray[state.operationArray.length - 1];

  return (
    <>
      <CalculatorContainer>
        <DisplayBox>
          <span>{[...state.operationArray, ...state.acumulatedDigits]}</span>
        </DisplayBox>

        <Button area="clear" color="red" onClick={() => clearAll()}>
          Clear
        </Button>
        <Button
          area="dividir"
          color="#E87F18"
          fontColor="white"
          disabled={lastOperation === "/" && !state.acumulatedDigits.length}
          onClick={() => enterOperation("/")}
        >
          /
        </Button>

        <Button area="um" onClick={() => enterDigit(1)}>
          1
        </Button>
        <Button area="dois" onClick={() => enterDigit(2)}>
          2
        </Button>
        <Button area="tres" onClick={() => enterDigit(3)}>
          3
        </Button>
        <Button
          area="mais"
          color="#E87F18"
          fontColor="white"
          disabled={lastOperation === "+" && !state.acumulatedDigits.length}
          onClick={() => enterOperation("+")}
        >
          +
        </Button>

        <Button area="quatro" onClick={() => enterDigit(4)}>
          4
        </Button>
        <Button area="cinco" onClick={() => enterDigit(5)}>
          5
        </Button>
        <Button area="seis" onClick={() => enterDigit(6)}>
          6
        </Button>
        <Button
          area="menos"
          color="#E87F18"
          fontColor="white"
          disabled={
            (lastOperation === "-" && !state.acumulatedDigits.length) ||
            state.acumulatedDigits.join("") === "-"
          }
          onClick={() => enterOperation("-")}
        >
          -
        </Button>

        <Button area="sete" onClick={() => enterDigit(7)}>
          7
        </Button>
        <Button area="oito" onClick={() => enterDigit(8)}>
          8
        </Button>
        <Button area="nove" onClick={() => enterDigit(9)}>
          9
        </Button>
        <Button
          area="vezes"
          color="#E87F18"
          fontColor="white"
          disabled={lastOperation === "*" && !state.acumulatedDigits.length}
          onClick={() => enterOperation("*")}
        >
          *
        </Button>

        <Button area="zero" onClick={() => enterDigit(0)}>
          0
        </Button>
        <Button
          area="igual"
          fontColor="white"
          color="#E87F18"
          onClick={() => enterResult()}
        >
          =
        </Button>

        {error === true ? <h3>ERROR</h3> : <></>}
      </CalculatorContainer>
    </>
  );
}

const isNumber = (n) => !isNaN(parseInt(n));

const CalculatorContainer = styled.div`
  display: grid;
  max-width: 480px;
  grid-template-areas:
    "display display display display"
    "clear clear clear dividir"
    "um dois tres mais"
    "quatro cinco seis menos"
    "sete oito nove vezes"
    "zero zero igual igual";
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 8px;
  padding: 16px;
  height: 300px;
  border: 1px solid;
`;

const DisplayBox = styled.div`
  grid-area: display;
  padding: 16px;
  margin: 8px;
  background-color: #e4f1ff;
  border: 1px solid;
  border-radius: 16px;
  border-size: border-box;
  max-width: 100%;
  height: 20px;
  align-items: center;
  display: flex;
`;

const Button = styled.button`
  background-color: ${({ color }) => color};
  color: ${({ fontColor }) => fontColor};
  grid-area: ${({ area }) => area};
  font-size: 18px;
  justify-content: center;
  border: 1px solid;
  padding: 8px;
  max-width: 100%;
`;
