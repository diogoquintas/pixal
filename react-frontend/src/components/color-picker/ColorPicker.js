import styled from "@emotion/styled";
import { useState } from "react";
import { css } from "@emotion/react";

const Wrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${({ color }) => color};

  ${({ isDisabled }) =>
    isDisabled &&
    css`
      cursor: not-allowed;
    `}
`;

const Picker = styled.input`
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

export default function ColorPicker({ color: colorRef, disabled }) {
  const [color, setColor] = useState(colorRef.current);

  return (
    <Wrapper color={color} isDisabled={disabled}>
      <Picker
        id="colorPicker"
        type="color"
        name="color"
        aria-label="Pick a color"
        title="Pick a color"
        value={color}
        onChange={(event) => {
          setColor(event.target.value);
        }}
        onBlur={() => {
          colorRef.current = color;
        }}
        disabled={disabled}
      />
    </Wrapper>
  );
}
