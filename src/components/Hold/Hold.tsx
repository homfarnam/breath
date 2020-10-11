import React, { FC, useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import classnames from "classnames";
import Case from "case";
import {
  makeCircleBigger,
  makeCircleShake,
  makeCircleSmaller,
} from "../../animations/AnimateCircle";

const Circle = styled.div`
  width: 250px;
  height: 250px;
`;

const ButtonsHolder = styled.div`
  button {
    outline: none;
  }
`;

let timer: any = null;

interface HoldProps {
  className?: String;
}

type stepState = "breath" | "hold" | "breathOut";

export const Hold: FC<HoldProps> = ({ className }) => {
  const DEFAULT_LENGTH = 4;
  const INITIAL_LENGTH =
    Number(localStorage.getItem("length")) || DEFAULT_LENGTH;

  const [length, setLength] = useState(INITIAL_LENGTH);
  const [counter, setCounter] = useState(length);
  const [step, setStep] = useState<stepState>("breath");
  const [isCounting, setIsCounting] = useState(false);
  const [repeat, setRepeat] = useState<number>(4);
  const circleRef = useRef<HTMLDivElement>(null);

  const circleClassnames = classnames(
    "rounded-full transition-colors duration-300 ease-in-out",
    {
      "bg-orange-500": step === "breath",
      "bg-red-500": step === "hold",
      "bg-teal-500": step === "breathOut",
    }
  );

  const startButtonClassnames = classnames(
    "text-white px-5 py-1 rounded-full mx-1",
    {
      "bg-blue-500": !isCounting,
      "bg-blue-300": isCounting,
    }
  );

  const resetButtonClasssnames = classnames(
    "text-white px-5 py-1 rounded-full mx-1",
    {
      "bg-gray-700": isCounting,
      "bg-gray-400": !isCounting,
    }
  );

  const addButton = classnames(
    "text-white px-5 py-1 rounded-full mx-1 cursor-pointer ",
    {
      "bg-blue-500": !isCounting,
      "bg-blue-300": isCounting,
    }
  );

  const decreaseButton = classnames(
    "text-white px-5 py-1 rounded-full mx-1 cursor-pointer ",
    {
      "bg-red-500": !isCounting,
      "bg-red-300": isCounting,
    }
  );

  const startTimer = () => {
    // reset the step
    setStep("breath");
    setIsCounting(true);

    cleanTimer();

    timer = setInterval(() => {
      countDown();
    }, 1000);
  };

  const countDown = () => {
    setCounter((counter) => counter - 1);
  };

  const addLength = () => {
    setLength((prev) => {
      const newLength = prev + 1;
      localStorage.setItem("length", JSON.stringify(newLength));

      // update current lenght
      setCounter(newLength);

      return newLength;
    });
  };

  const decreaseLength = () => {
    setLength((prev) => {
      const newLength = prev - 1;
      if (newLength >= DEFAULT_LENGTH) {
        localStorage.setItem("length", JSON.stringify(newLength));

        // update current lenght
        setCounter(newLength);

        return newLength;
      }

      return DEFAULT_LENGTH;
    });
  };

  const addRepeat = () => {
    setRepeat((prev) => prev + 1);
  };

  const decreaseRepeat = () => {
    setRepeat((prev) => prev - 1);
  };

  const reset = useCallback(() => {
    cleanTimer();
    setIsCounting(false);
    setStep("breath");
    setCounter(length);
    makeCircleSmaller(circleRef.current, length);
  }, [length, circleRef]);

  const cleanTimer = () => {
    clearInterval(timer);
    timer = null;
  };

  useEffect(() => {
    if (isCounting) {
      if (counter === 0 && step === "breath") {
        setStep("hold");
        setCounter(length);
      } else if (counter === 0 && step === "hold") {
        setStep("breathOut");
        setCounter(length);
      } else if (counter === 0 && step === "breathOut") {
        setStep("breath");
        setLength((prevLength) => {
          const length = prevLength + 1;

          setCounter(length);
          return length;
        });
      }
    }
  }, [isCounting, counter, step, length]);

  useEffect(() => {
    if (isCounting) {
      if (counter === length && step === "breath") {
        makeCircleBigger(circleRef.current, length);
      } else if (counter === length && step === "hold") {
        makeCircleShake(circleRef.current);
      } else if (counter === length && step === "breathOut") {
        makeCircleSmaller(circleRef.current, length);
      }
    }
  }, [isCounting, counter, step, length, circleRef]);

  useEffect(() => {
    if (counter > repeat) {
      cleanTimer();
    }
  }, [repeat, counter]);

  return (
    <div className={`flex flex-col justify-center items-center   ${className}`}>
      <div className="circle-holder relative flex items-center justify-center">
        <Circle ref={circleRef} className={circleClassnames} />
        <div className="absolute text-center h-100 w-100">
          <h2 className="text-3xl font-semibold mb-2">{Case.capital(step)}</h2>
          <span className="text-xl">{counter}</span>
        </div>
      </div>

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

      <div className="flex flex-col mt-10">
        <p>Number of repetition: {repeat}</p>

        <ButtonsHolder className="flex flex-row mt-5 justify-center">
          <button
            className={addButton}
            disabled={isCounting}
            onClick={addRepeat}
          >
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
    </div>
  );
};

export default Hold;
