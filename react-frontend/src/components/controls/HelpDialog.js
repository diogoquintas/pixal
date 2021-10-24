import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Cursor from "../icons/Cursor";
import Eraser from "../icons/Eraser";
import Pencil from "../icons/Pencil";
import styled from "@emotion/styled";

const DialogContentTextWithIcons = styled(DialogContentText)`
  & > svg {
    width: 1rem;
    height: 1rem;
  }
`;

export default function HelpDialog(props) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogTitle>how</DialogTitle>
        <DialogContentTextWithIcons>
          [<Cursor />] - Move around and select pixels for more info.
        </DialogContentTextWithIcons>
        <DialogContentTextWithIcons>
          [<Eraser />] - Delete your local changes, you can select the size of
          the block.
        </DialogContentTextWithIcons>
        <DialogContentTextWithIcons>
          [<Pencil />] - Paint! You can select the color and size of the block.
        </DialogContentTextWithIcons>
        <DialogTitle>KEYBOARD CONTROLS</DialogTitle>
        <DialogContentText>[P] - Paint mode</DialogContentText>
        <DialogContentText>[D] - Delete mode</DialogContentText>
        <DialogContentText>[M] - Move mode</DialogContentText>
        <DialogContentText>[C] - Open color picker</DialogContentText>
        <DialogContentText>[Arrows] - Move the camera</DialogContentText>
        <DialogContentText>[+/-] - Zoom in/out</DialogContentText>
        <DialogContentText>[Space] - Interact</DialogContentText>
        <DialogTitle>transactions</DialogTitle>
        <DialogContentText>
          {`There is no limit to the pixels an account can paint but there is a
          limit of ${process.env.REACT_APP_MAX_PIXELS_PER_TRANSACTION} pixels
          for each transaction, everything above ${process.env.REACT_APP_MAX_PIXELS_PER_TRANSACTION} requires multiple
          transactions.`}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
