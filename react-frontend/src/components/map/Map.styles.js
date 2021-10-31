import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { mobileMediaScreen } from "../../styles/media";
import { Button } from "@mui/material";

export const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: none;
`;

export const CoordinatesWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Coordinates = styled.p`
  color: ${({ isOutside, color }) => {
    if (color) {
      return color;
    }

    if (isOutside) {
      return "red";
    }

    return "white";
  }};

  ${({ color }) =>
    color &&
    css`
      background-color: ${color};

      & > span {
        filter: invert(100%);
      }
    `}
`;

export const MapWrapper = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 15rem;
  height: 15rem;
  border-radius: 4px;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  border: 0.1rem solid white;
  transition: ease opacity 150ms;
  opacity: 1;
  cursor: pointer;
  background: black;
  overflow: hidden;

  ${({ canShow }) =>
    !canShow &&
    css`
      width: 0;
      height: 0;
      opacity: 0;
    `}
`;

export const Marker = styled.div`
  position: absolute;
  border: 0.1rem solid var(--secondary-color);
  cursor: grab;
`;

export const InfoWrapper = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 17rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: black;
  padding: 0.3rem 0.6rem;
  border: 0.1rem solid white;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  border-radius: 4px;
  box-sizing: border-box;

  @media only screen and (max-width: 1136px) {
    bottom: 17rem;
    right: 1rem;
  }

  ${mobileMediaScreen} {
    right: unset;
    left: 1rem;
    bottom: 4rem;
    max-width: calc(100% - 2rem);
    align-items: flex-start;
  }
`;

export const MapButton = styled(Button)`
  position: fixed;
  top: 1rem;
  right: 19rem;

  & > svg {
    height: 1.5rem;
  }
`;

export const InfoButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0.3rem;
`;

export const InfoButton = styled.button`
  background: none;
  color: white;
  padding: 0;
  margin: 0;
  border: 0;
  cursor: pointer;
  font-size: 1.5rem;

  & > svg {
    width: 1rem;
    height: 1rem;
  }

  &:first-of-type {
    margin-right: 0.3rem;
  }
`;
