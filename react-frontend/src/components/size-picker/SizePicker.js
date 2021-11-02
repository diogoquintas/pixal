import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";

export const MIN_SIZE = 1;
export const MAX_SIZE = 5;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-right: 0.5rem;

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
        name="size"
        value={size}
        onChange={(e, newSize) => setSize(newSize)}
        aria-label="Select the brush size"
        title="Select the brush size"
        step={1}
        min={MIN_SIZE}
        max={MAX_SIZE}
      />
    </Wrapper>
  );
}
