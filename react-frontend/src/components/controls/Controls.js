import { MODE } from "../../App";
import ColorPicker from "../color-picker/ColorPicker";
import Arrows from "../icons/Arrows";
import Eraser from "../icons/Eraser";
import Pencil from "../icons/Pencil";
import SizePicker from "../size-picker/SizePicker";
import { Control, Wrapper, Pickers } from "./Controls.styles";

export default function Controls({ mode, setMode, color, size }) {
  const isDelete = mode === MODE.delete;
  const isMove = mode === MODE.move;
  const isPaint = mode === MODE.paint;

  return (
    <Wrapper>
      <div>
        <Control
          onClick={() => setMode(MODE.move)}
          variant={isMove ? "contained" : "outlined"}
          aria-label="Set to move"
          title="Set to move"
        >
          <Arrows />
        </Control>
        <Control
          onClick={() => setMode(MODE.delete)}
          variant={isDelete ? "contained" : "outlined"}
          aria-label="Set to delete"
          title="Select delete"
        >
          <Eraser />
        </Control>
        <Control
          onClick={() => setMode(MODE.paint)}
          variant={isPaint ? "contained" : "outlined"}
          aria-label="Set to paint"
          title="Set to paint"
        >
          <Pencil />
        </Control>
      </div>
      {(isPaint || isDelete) && (
        <Pickers>
          <ColorPicker color={color} />
          <SizePicker size={size} />
        </Pickers>
      )}
    </Wrapper>
  );
}
