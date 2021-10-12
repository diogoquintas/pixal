import styled from "@emotion/styled";
import hideScrollbar from "./styles/hideScrollbar";

export const AlertWrapper = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  max-width: 32rem;
  display: flex;
  justify-content: center;

  & a {
    color: white;
  }
`;

export const ErrorPre = styled.pre`
  white-space: pre-wrap;
  max-width: 25rem;
  overflow: auto;

  ${hideScrollbar}
`;
