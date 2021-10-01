import styled from "@emotion/styled";
import Button from "@mui/material/Button";

export const Wrapper = styled.div`
  position: fixed;
  left: 1rem;
  top: 1rem;
  display: flex;
  flex-direction: column;
`;

export const Control = styled(Button)`
  margin-right: 0.5rem;

  & svg {
    fill: currentColor;
  }

  &:last-of-type  {
    margin-right: 0;
  }
`;

export const Pickers = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;
