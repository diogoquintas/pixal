import styled from "@emotion/styled";
import hideScrollbar from "./styles/hideScrollbar";
import { mobileMediaScreen } from "./styles/media";

export const AlertWrapper = styled.div`
  position: fixed;
  top: 1rem;
  left: 1rem;
  max-width: 32rem;
  max-height: calc(100% - 2rem);
  display: flex;
  justify-content: center;
  text-transform: initial;
  z-index: 1;

  & a {
    color: white;
  }

  ${mobileMediaScreen} {
    width: calc(100% - 2rem);
  }
`;

export const ErrorPre = styled.pre`
  margin-top: 0;
  white-space: pre-wrap;
  max-width: 25rem;
  overflow: auto;

  ${hideScrollbar}
`;
