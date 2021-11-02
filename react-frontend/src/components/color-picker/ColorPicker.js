import styled from "@emotion/styled";
import { useState } from "react";

const Wrapper = styled.div`
  height: 36px;
  width: 64px;
  background-color: ${({ color }) => color};
  border-radius: 4px;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  border: 1px solid var(--main-color);
  box-sizing: border-box;
`;

const Picker = styled.input`
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

export default function ColorPicker({ color: colorRef }) {
  const [color, setColor] = useState(colorRef.current);

  return (
    <Wrapper color={color}>
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
      />
    </Wrapper>
  );
}
