import { useState } from "react";
import { MODE } from "../../App";
import ColorPicker from "../color-picker/ColorPicker";
import Cursor from "../icons/Cursor";
import Eraser from "../icons/Eraser";
import Pencil from "../icons/Pencil";
import SizePicker from "../size-picker/SizePicker";
import { Control, Wrapper, Pickers } from "./Controls.styles";
import HelpDialog from "./HelpDialog";

export default function Controls({ mode, setMode, color, size, loading }) {
  const [openHelp, setOpenHelp] = useState(false);

  const isDelete = mode === MODE.delete;
  const isMove = mode === MODE.move;
  const isPaint = mode === MODE.paint;

  return (
    <Wrapper>
      {(isPaint || isDelete) && (
        <Pickers>
          <SizePicker disabled={loading} size={size} />
          {isPaint && <ColorPicker disabled={loading} color={color} />}
        </Pickers>
      )}
      <div>
        <Control
          onClick={() => setOpenHelp(true)}
          variant="outlined"
          aria-label="Help"
          title="Help"
        >
          ?
        </Control>
        <Control
          onClick={() => setMode(MODE.move)}
          variant={isMove ? "contained" : "outlined"}
          aria-label="Set to move"
          title="Set to move"
        >
          <Cursor />
        </Control>
        <Control
          onClick={() => setMode(MODE.delete)}
          variant={isDelete ? "contained" : "outlined"}
          aria-label="Set to delete"
          title="Set to delete"
          disabled={loading}
        >
          <Eraser />
        </Control>
        <Control
          onClick={() => setMode(MODE.paint)}
          variant={isPaint ? "contained" : "outlined"}
          aria-label="Set to paint"
          title="Set to paint"
          disabled={loading}
        >
          <Pencil />
        </Control>
      </div>
      <HelpDialog open={openHelp} onClose={() => setOpenHelp(false)} />
    </Wrapper>
  );
}
