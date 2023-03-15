import { useState } from "react";
import styled from "styled-components";

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
      <Container>
        <NumberDisplayBox>
          <NumberDisplay>{counterNumber}</NumberDisplay>
        </NumberDisplayBox>
        <ControlerBox>
          <Button
            width="48px"
            color="#e40a0a"
            className="button"
            onClick={DecrementCounter}
          >
            -
          </Button>
          <Button
            color="#e39c29"
            width="160px"
            className="button"
            onClick={ResetCounter}
          >
            Reset
          </Button>
          <Button
            width="48px"
            color="#00bd6a"
            className="button"
            onClick={IncrementCounter}
          >
            +
          </Button>
        </ControlerBox>
      </Container>
    </>
  );
}

const NumberDisplay = styled.h1`
  font-size: 3.5em;
  text-align: center;
  font-family: Poppins;
`;

const Container = styled.div`
  padding: 32px;
  margin: 0px;
  border-color: #d7dae0;
  border: 1px solid;
  border-radius: 32px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  max-width: 50%;
  margin: auto;
  background-color: #eff0f2;
`;

const NumberDisplayBox = styled.div`
  padding: 8px;
  margin: 8px;
  background-color: #e4f1ff;
  border: 1px solid;
  border-radius: 16px;
  width: 240px;
  height: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const ControlerBox = styled.div`
  padding: 8px;
  margin: 8px;
  display: flex;
`;

const Button = styled.button`
  font-size: 2.5em;
  text-align: center;
  border-radius: 8px;
  border-color: #bdc2cc;
  background-color: ${({ color }) => color};
  width: ${({ width }) => width};
  font-family: Poppins;
`;
