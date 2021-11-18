import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import borderStyles from "../../styles/borderStyles";
import { mobileMediaScreen } from "../../styles/media";

export const Wrapper = styled.div`
  position: fixed;
  right: 1rem;
  top: 1rem;
  flex-direction: column-reverse;
  display: flex;
  background: black;
  padding: 0.5rem;

  ${borderStyles}

  ${mobileMediaScreen} {
    padding-left: 3.5rem;
  }
`;

export const Control = styled(Button)`
  margin-right: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  min-width: 0;
  padding: 0;

  & svg {
    fill: currentColor;
    height: 1.5rem;
  }

  &:last-of-type  {
    margin-right: 0;
  }

  &:first-of-type {
    font-size: 1.5rem;
  }
`;

export const Pickers = styled.div`
  display: flex;
  margin: 0.5rem 0;
`;
