import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";
import { useRef, useState } from "react";

const marquiesh = keyframes`
 0% {
    transform: scale(1);
  }

  98% {
    transform: scale(0.1);
    color: orangered;
    
  }

  99% {
    transform: scale(10);
    color: red;
    
  }

  100% {
    transform: scale(10);
    color: black;
  }
`;

const H1 = styled.h1`
  font-size: 13rem;
  text-transform: uppercase;
  font-weight: bold;
  color: var(--secondary-color);
  user-select: none;
  margin-bottom: 1rem;
  font-family: "Perfect DOS VGA";
  margin: 0;
  cursor: url("play.png"), pointer;
  transition: ease-in font-size 150ms;

  @media only screen and (max-width: 768px) {
    font-size: 7rem;
  }

  ${({ animate }) =>
    animate &&
    css`
      font-size: 62rem;
      animation: ${marquiesh} 82s ease 10ms forwards;
      cursor: url("stop.png"), pointer;

      @media only screen and (max-width: 768px) {
        font-size: 41rem;
      }
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
