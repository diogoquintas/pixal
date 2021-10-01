import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";

export const MIN_SIZE = 1;
export const MAX_SIZE = 5;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 0.5rem;

  & > span {
    margin: 0 0.5rem;
  }
`;

export default function SizePicker({ size: sizeRef }) {
  const [size, setSize] = useState(sizeRef.current);

  useEffect(() => {
    sizeRef.current = size;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  return (
    <Wrapper>
      <Slider
        value={size}
        onChange={(e, newSize) => setSize(newSize)}
        aria-label="Select pixel size"
        step={1}
        min={MIN_SIZE}
        max={MAX_SIZE}
      />
    </Wrapper>
  );
}
