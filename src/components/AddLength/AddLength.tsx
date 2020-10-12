import * as React from "react";
import styled from "styled-components";

const ButtonsHolder = styled.div`
  button {
    outline: none;
  }
`;

interface AddLengthProps {
  addButton: string;
  isCounting: boolean;
  addLength: () => void;
  decreaseButton: string;
  decreaseLength: () => void;
}

const AddLength: React.FC<AddLengthProps> = ({
  addButton,
  isCounting,
  addLength,
  decreaseButton,
  decreaseLength,
}) => {
  return (
    <ButtonsHolder className="flex flex-row mt-5">
      <button className={addButton} disabled={isCounting} onClick={addLength}>
        +
      </button>

      <button
        className={decreaseButton}
        disabled={isCounting}
        onClick={decreaseLength}
      >
        -
      </button>
    </ButtonsHolder>
  );
};

export default AddLength;
