import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { mobileMediaScreen } from "../../styles/media";
import { Button } from "@mui/material";
import borderStyles from "../../styles/borderStyles";

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
  flex-direction: column;
  width: 6rem;
  background-color: black;

  ${borderStyles}
`;

export const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  width: 15rem;

  ${borderStyles}

  ${mobileMediaScreen} {
    width: 100%;
  }
`;

export const Row = styled.p`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
`;

export const Color = styled.div`
  background-color: ${({ color }) => color};
  color: ${({ color }) => color};

  & > span {
    filter: invert(100%);
  }
`;

export const AddressColumn = styled.div`
  display: flex;

  & > button {
    background: 0;
    padding: 0;
    margin: 0;
    border: 0;
    width: 0.8rem;
    height: 0.8rem;
    color: white;
    margin-right: 0.3rem;
  }

  & > span {
    max-width: 7rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Heading = styled.span`
  border-bottom: 0.1rem solid grey;
  background: white;
  color: black;
  padding: 0.3rem;
  position: relative;
  text-transform: uppercase;
`;

export const MapWrapper = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 15rem;
  height: 15rem;
  transition: ease opacity 150ms;
  opacity: 1;
  cursor: pointer;
  background: black;
  overflow: hidden;

  ${borderStyles}

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
  align-items: flex-end;

  @media only screen and (max-width: 976px) {
    bottom: 17rem;
    right: 1rem;
    flex-direction: column;
  }

  ${mobileMediaScreen} {
    right: unset;
    left: 1rem;
    bottom: ${({ hasPixels }) => (hasPixels ? "4rem" : "1rem")};
    width: calc(100% - 2rem);
    align-items: flex-start;
  }

  & > div:first-of-type:not(:last-of-type) {
    margin-right: 0.4rem;

    @media only screen and (max-width: 976px) {
      margin-bottom: 0.4rem;
    }
  }

  ${({ isLoading }) =>
    isLoading &&
    css`
      flex-direction: column;

      & > div {
        margin-bottom: 1rem;
      }
    `}
`;

export const MapButton = styled(Button)`
  position: fixed;
  top: 1.6rem;
  right: 13.5rem;
  width: 2.5rem;
  height: 2.5rem;
  min-width: 0;
  padding: 0;

  & > svg {
    height: 1.5rem;
  }
`;

export const InfoButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
  position: absolute;
  top: 0;
  right: 0.4rem;
  height: 100%;
`;

export const InfoButton = styled.button`
  background: none;
  color: white;
  padding: 0;
  margin: 0;
  border: 0;
  cursor: pointer;
  font-size: 1rem;
  border: 0.1rem solid rgba(255, 255, 255, 0.5);
  padding: 0 0.3rem;
  background: black;

  &:first-of-type {
    margin-right: 0.4rem;
  }
`;

export const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  word-break: break-all;

  ${mobileMediaScreen} {
    align-items: flex-start;
  }
`;
