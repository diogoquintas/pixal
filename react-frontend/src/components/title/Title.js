import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";
import { useRef, useState } from "react";

const marquiesh = keyframes`
  3% {
    transform: scaleY(1.3) rotate(-180deg);
  }

  6% {
    transform: scaleX(1.3) rotate(-180deg) translateX(30%);
  }

  9% {
    transform: scaleY(1.3) rotate(-180deg);
  }

  11% {
    transform: scale(1.3) rotate(-180deg) translateX(30%);
  }

  16% {
    transform: scale(1.3) rotate(-180deg) translateX(10%);
    color: black;
  }

  30% {
    transform: scale(2.3) rotate(-180deg) translateX(15%);
    color: red;
  }

  60% {
    transform: scale(3.3) rotate(-180deg) translateX(20%);
    color: blue;
  }

  90% {
    transform: scale(4.3) rotate(-180deg) translateX(15%);
    color: yellow;
  }

  98% {
    transform: scale(10) rotate(-180deg) translateX(10%);
    color: white;
  }

  100% {
    transform: scale(1) rotate(-180deg);
    color: lightblue;
  }
`;

const H1 = styled.h1`
  font-size: 5rem;
  text-transform: uppercase;
  font-weight: bold;
  color: var(--secondary-color);
  user-select: none;
  margin-bottom: 1rem;
  font-family: "Perfect DOS VGA";
  margin: 0;
  cursor: url("play.png"), pointer;
  writing-mode: tb-rl;
  transform: rotate(-180deg);
  transition: transform 300ms ease;

  ${({ animate }) =>
    animate &&
    css`
      animation: ${marquiesh} 82s ease 10ms forwards;
      cursor: url("stop.png"), pointer;
    `}
`;

const BetaTag = styled.span`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  color: var(--secondary-color);
  font-size: 12px;
`;

export default function Title({ title }) {
  const [start, setStart] = useState(false);

  const audioRef = useRef();

  const stop = () => {
    setStart(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <H1
        onAnimationEnd={stop}
        animate={start}
        onClick={() => {
          if (start) {
            stop();
          } else {
            setStart(true);
            audioRef.current?.play();
          }
        }}
      >
        {`${title}`}
      </H1>
      <BetaTag>version 0.1</BetaTag>
      <audio ref={audioRef} src="/intro.mp3"></audio>
    </>
  );
}
