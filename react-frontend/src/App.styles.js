import styled from "@emotion/styled";

export const AlertWrapper = styled.div`
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: calc(100% - 2rem);
  display: flex;
  justify-content: center;

  & a {
    color: white;
  }
`;
