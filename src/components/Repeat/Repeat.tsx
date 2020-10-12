import * as React from "react";
import styled from "styled-components";

const ButtonsHolder = styled.div`
  button {
    outline: none;
  }
`;
interface RepeatProps {
  repeat: number;
  addButton: string;
  isCounting: boolean;
  addRepeat: () => void;
  decreaseButton: string;
  decreaseRepeat: () => void;
}

const Repeat: React.FC<RepeatProps> = ({
  repeat,
  addButton,
  isCounting,
  addRepeat,
  decreaseButton,
  decreaseRepeat,
}) => {
  return (
    <div className="flex flex-col mt-10">
      <p>Number of repetition: {repeat}</p>

      <ButtonsHolder className="flex flex-row mt-5 justify-center">
        <button className={addButton} disabled={isCounting} onClick={addRepeat}>
          +
        </button>

        <button
          className={decreaseButton}
          disabled={isCounting}
          onClick={decreaseRepeat}
          name="btn"
        >
          -
        </button>
      </ButtonsHolder>
    </div>
  );
};

export default Repeat;
