import * as React from "react";
import styled from "styled-components";

const ButtonsHolder = styled.div`
  button {
    outline: none;
  }
`;

interface StartProps {
  startButtonClassnames: string;
  isCounting: boolean;
  startTimer: () => void;
  resetButtonClasssnames: string;
  reset: () => void;
}

const Start: React.FC<StartProps> = ({
  startButtonClassnames,
  isCounting,
  startTimer,
  resetButtonClasssnames,
  reset,
}) => {
  return (
    <ButtonsHolder className="flex flex-row mt-24">
      <button
        className={startButtonClassnames}
        disabled={isCounting}
        onClick={startTimer}
      >
        Start
      </button>

      <button
        className={resetButtonClasssnames}
        onClick={reset}
        disabled={!isCounting}
      >
        Reset
      </button>
    </ButtonsHolder>
  );
};

export default Start;
