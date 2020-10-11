import gsap from "gsap";

export const makeCircleBigger = (
  circle: HTMLDivElement | null,
  duration: number
) => {
  gsap.to(circle, {
    scale: 1.5,
    duration,
  });
};

export const makeCircleShake = (circle: HTMLDivElement | null) => {
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
};

export const makeCircleSmaller = (
  circle: HTMLDivElement | null,
  duration: number
) => {
  gsap.to(circle, {
    scale: 1,
    duration,
  });
};
