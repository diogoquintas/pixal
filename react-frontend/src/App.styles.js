import styled from "@emotion/styled";
import { mobileMediaScreen } from "./styles/media";

export const AlertWrapper = styled.div`
  position: fixed;
  top: 1rem;
  left: 1rem;
  max-width: 32rem;
  max-height: calc(100% - 2rem);
  display: flex;
  justify-content: center;
  text-transform: initial;
  z-index: 1;

  & a {
    color: white;
  }

  ${mobileMediaScreen} {
    width: calc(100% - 2rem);
  }
`;

export const Loading = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.5rem;
  background-color: var(--main-color);
  z-index: 100;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ progress }) => progress}%;
    background-color: var(--secondary-color);
    transition: width 300ms ease;
  }
`;
