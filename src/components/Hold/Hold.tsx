import React, { FC, useState, useRef, useEffect, useCallback } from "react";
import classnames from "classnames";
import {
  makeCircleBigger,
  makeCircleShake,
  makeCircleSmaller,
} from "../../animations/AnimateCircle";
import Counter from "../Counter/Counter";
import Start from "../Start/Start";
import AddLength from "../AddLength/AddLength";
import Repeat from "../Repeat/Repeat";

let timer: any = null;

interface HoldProps {
  className?: String;
}

type stepState = "breath" | "hold" | "breathOut";

export const Hold: FC<HoldProps> = ({ className }) => {
  const DEFAULT_LENGTH = 4;
  const INITIAL_LENGTH =
    Number(localStorage.getItem("length")) || DEFAULT_LENGTH;

  const DEFAULT_REPEAT = 3;
  const INITIAL_REPEAT =
    Number(localStorage.getItem("repeat")) || DEFAULT_REPEAT;

  const [length, setLength] = useState(INITIAL_LENGTH);
  const [counter, setCounter] = useState(length);
  const [step, setStep] = useState<stepState>("breath");
  const [isCounting, setIsCounting] = useState(false);
  const [repeat, setRepeat] = useState<number>(INITIAL_REPEAT);
  const [repeater, setRepeater] = useState<number>(0);
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
      localStorage.setItem("length", newLength.toString());

      // update current lenght
      setCounter(newLength);

      return newLength;
    });
  };

  const decreaseLength = () => {
    setLength((prev) => {
      const newLength = prev - 1;
      if (newLength >= DEFAULT_LENGTH) {
        localStorage.setItem("length", newLength.toString());

        // update current lenght
        setCounter(newLength);

        return newLength;
      }

      return DEFAULT_LENGTH;
    });
  };

  const addRepeat = () => {
    setRepeat((prev) => {
      const next = prev + 1;
      localStorage.setItem("repeat", next.toString());

      return next;
    });
  };

  const decreaseRepeat = () => {
    setRepeat((prev) => {
      const next = prev - 1;

      if (next >= DEFAULT_REPEAT) {
        localStorage.setItem("repeat", next.toString());
        return next;
      }

      return DEFAULT_REPEAT;
    });
  };

  const reset = useCallback(() => {
    cleanTimer();
    setIsCounting(false);
    setStep("breath");
    setCounter(length);
    setRepeater(0);
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
        setRepeater((prev) => prev + 1);
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
    if (repeater === repeat) {
      reset();
    }
  }, [repeater, repeat, reset]);

  return (
    <div className={`flex flex-col justify-center items-center   ${className}`}>
      <Counter
        circleClassnames={circleClassnames}
        circleRef={circleRef}
        counter={counter}
        step={step}
      />

      <Start
        isCounting={isCounting}
        reset={reset}
        resetButtonClasssnames={resetButtonClasssnames}
        startButtonClassnames={startButtonClassnames}
        startTimer={startTimer}
      />

      <AddLength
        addButton={addButton}
        addLength={addLength}
        decreaseButton={decreaseButton}
        decreaseLength={decreaseLength}
        isCounting={isCounting}
      />

      <Repeat
        repeat={repeat}
        isCounting={isCounting}
        decreaseRepeat={decreaseRepeat}
        addRepeat={addRepeat}
        addButton={addButton}
        decreaseButton={decreaseButton}
      />
    </div>
  );
};

export default Hold;
