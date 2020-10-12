import * as React from "react";
import Case from "case";
import styled from "styled-components";

const Circle = styled.div`
  width: 250px;
  height: 250px;
`;

interface CounterProps {
  circleRef: React.RefObject<HTMLDivElement>;
  circleClassnames: string;
  step: string;
  counter: number;
}

const Counter: React.FC<CounterProps> = ({
  circleRef,
  circleClassnames,
  step,
  counter,
}) => {
  return (
    <div className="circle-holder relative flex items-center justify-center">
      <Circle ref={circleRef} className={circleClassnames} />
      <div className="absolute text-center h-100 w-100">
        <h2 className="text-3xl font-semibold mb-2">{Case.capital(step)}</h2>
        <span className="text-xl">{counter}</span>
      </div>
    </div>
  );
};

export default Counter;
