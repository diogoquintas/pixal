import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";
import { useRef, useState } from "react";

const marquiesh = keyframes`
 0% {
    transform: scaleX(1) translate(-50%, -50%) rotate(225deg);
  }

  98% {
    transform: scaleX(0.1) translate(-50%, -50%) rotate(225deg);
    color: orangered;
  }

  99% {
    transform: scaleX(10) translate(-50%, -50%) rotate(225deg);
    color: red;
  }

  100% {
    transform: scaleX(10) translate(-50%, -50%) rotate(225deg);
    color: black;
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
  transition: ease-in font-size 150ms;
  writing-mode: tb-rl;
  transform: rotate(-180deg);

  ${({ animate }) =>
    animate &&
    css`
      position: fixed;
      top: 50%;
      left: 50%;
      font-size: 62rem;
      transform: translate(-50%, -50%) rotate(225deg);
      animation: ${marquiesh} 82s ease 10ms forwards;
      cursor: url("stop.png"), pointer;
    `}
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
      <audio ref={audioRef} src="/intro.mp3"></audio>
    </>
  );
}
