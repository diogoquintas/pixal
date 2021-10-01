import { useEffect } from "react";
import styled from "@emotion/styled";

const P = styled.p`
  font-size: 1.2rem;
  color: var(--secondary-color);
`;

export default function Loading({ drawMap }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(drawMap, []);

  return <P>Loading blockchain data...</P>;
}
