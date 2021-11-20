import styled from "@emotion/styled";
import LoadingButton from "@mui/lab/LoadingButton";

export const ConnectButton = styled(LoadingButton)`
  background-color: var(--secondary-color);
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
  justify-content: center;
  margin-right: 1rem;

  & > button {
    margin: 0;
  }
`;
