import { useEffect } from "react";
import styled from "@emotion/styled";

const P = styled.p`
  font-size: 1.2rem;
  color: var(--secondary-color);
  align-self: center;
  margin: 1rem;
`;

export default function Loading({ onMount }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(onMount, []);

  return (
    <P>
      It gotta be back here somewhere, I'll find that painting for you, wait a
      sec.
    </P>
  );
}
