import styled from "@emotion/styled";
import Button from "@mui/material/Button";

export const Wrapper = styled.div`
  position: fixed;
  right: 1rem;
  top: 1rem;
  flex-direction: column-reverse;
  display: flex;
`;

export const Control = styled(Button)`
  margin-right: 0.5rem;

  & svg {
    fill: currentColor;
    height: 1.5rem;
  }

  &:last-of-type  {
    margin-right: 0;
  }

  &:first-of-type {
    font-size: 1.5rem;
    height: 2.25rem;
  }
`;

export const Pickers = styled.div`
  display: flex;
  margin: 0.5rem 0;
`;
