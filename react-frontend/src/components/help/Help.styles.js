import styled from "@emotion/styled";
import Button from "@mui/material/Button";

export const HelpButton = styled(Button)`
  margin-left: 1rem;
  background-color: transparent;
  border-color: var(--secondary-color);
  color: var(--secondary-color);

  &:hover {
    background: transparent;
    border-color: var(--secondary-color);
  }
`;
