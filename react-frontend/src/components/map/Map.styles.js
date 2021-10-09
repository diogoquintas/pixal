import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const MAP_SIZE = 240;

export const Wrapper = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
`;

export const Coordinates = styled.p`
  color: ${({ isOutside, color }) => {
    if (color) {
      return color;
    }

    if (isOutside) {
      return "red";
    }

    return "var(--main-color)";
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
  position: relative;
  width: ${MAP_SIZE}px;
  height: ${MAP_SIZE}px;
  border-radius: 4px;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  border: 1px solid var(--main-color);
  transition: linear opacity 300ms;
  opacity: ${({ canShow }) => (canShow ? 1 : 0)};
  margin-top: 0.5rem;
  cursor: pointer;
  background: black;
  overflow: hidden;
`;

export const Marker = styled.div`
  position: absolute;
  border: 0.1rem solid var(--secondary-color);
  pointer-events: none;
`;

export const InfoDiv = styled.div`
  background: black;
`;
