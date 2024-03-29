import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import hideScrollbar from "../../styles/hideScrollbar";
import List from "react-virtualized/dist/commonjs/List";
import { css, keyframes } from "@emotion/react";

const disapear = keyframes`
  0% {
    transform: scaleY(1);
  }

  80% {
    transform: scaleY(0.4);
  }

  100% {
    transform: scaleY(0.4) translateX(-100%);
  }
`;

export const ControlsWrapper = styled.div`
  position: fixed;
  left: 1rem;
  bottom: 1rem;
`;

export const Control = styled(Button)`
  margin-right: 0.5rem;
  font-size: 1rem;

  & svg {
    fill: currentColor;
    margin-left: 0.5rem;
    width: 1rem;
    height: 1rem;
  }

  &:last-of-type  {
    margin-right: 0;
  }
`;

export const StyledList = styled(List)`
  ${hideScrollbar}
`;

export const Item = styled.div`
  display: flex;
  transition: position 150ms ease;

  & > div {
    margin: auto 0;
    height: 40px;
    display: flex;
    align-items: center;

    & > span {
      width: 5.9rem;
      margin-left: 0.5rem;
      flex-shrink: 0;
    }
  }

  ${({ inDeleteQueue }) =>
    inDeleteQueue
      ? css`
          animation: ${disapear} 150ms ease forwards;
        `
      : css`
          &:hover {
            background: var(--secondary-color);
          }
        `}
`;

export const ListWrapper = styled.div`
  position: fixed;
  left: 1rem;
  bottom: 4rem;
  transform: translateX(${({ open }) => (open ? "0" : "calc(-100% - 5rem)")});
  transition: transform 150ms ease;
  background: black;
  border: 0.1rem solid white;
  z-index: 100;
  box-sizing: border-box;
  height: calc(100% - 5rem);
  overflow: hidden;
`;

export const Color = styled.div`
  background-color: ${({ color }) => color};
  text-align: center;
  height: 1.5rem;
  width: 5.4rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;

  & > span {
    color: ${({ color }) => color};
    filter: invert(100%);
  }
`;

export const Delete = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  appearance: none;
  color: white;
  margin-left: 0.5rem;
  cursor: pointer;

  &:hover  {
    text-decoration: underline;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
`;

export const Value = styled.span`
  width: 6.2rem !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
