import React, { FC, useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import gsap from "gsap";
import classnames from "classnames";
import Case from "case";

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

function makeCircleBigger(circle: HTMLDivElement | null, duration: number) {
  gsap.to(circle, {
    scale: 1.5,
    duration,
  });
}

function makeCircleShake(circle: HTMLDivElement | null) {
  gsap.to(circle, {
    x: 3,
    duration: 0.1,
    delay: 0.1,
  });
  gsap.to(circle, {
    x: -3,
    duration: 0.1,
    delay: 0.2,
  });
  gsap.to(circle, {
    x: 3,
    duration: 0.1,
    delay: 0.3,
  });
}

function makeCircleSmaller(circle: HTMLDivElement | null, duration: number) {
  gsap.to(circle, {
    scale: 1,
    duration,
  });
}

interface HoldProps {
  className?: String;
}

type stepState = "breath" | "hold" | "breathOut";

export const Hold: FC<HoldProps> = ({ className }) => {
  localStorage.setItem("length", JSON.stringify(4));
  const length2 = localStorage.getItem("length");

  const [length, setLength] = useState(4);
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

  const addButton = classnames("text-white px-5 py-1 rounded-full mx-1  ", {
    "bg-blue-500": !isCounting,
    "bg-blue-300": isCounting,
  });

  const decreaseButton = classnames("text-white px-5 py-1 rounded-full mx-1 ", {
    "bg-red-500": !isCounting,
    "bg-red-300": isCounting,
  });

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
      setCounter(newLength);

      return newLength;
    });
  };

  const decreaseLength = () => {
    setLength((prev) => {
      const newLength = prev - 1;
      setCounter(newLength);

      return newLength;
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

  // const resetCircle = () => {
  //   gsap.to(circleRef.current, {
  //     scale: 1,
  //     duration: 1,
  //   })
  // }

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
          >
            -
          </button>
        </ButtonsHolder>
      </div>
    </div>
  );
};

export default Hold;
