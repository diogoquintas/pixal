import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function HelpDialog(props) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogTitle>KEYBOARD CONTROLS</DialogTitle>
        <DialogContentText>[P] - Paint mode</DialogContentText>
        <DialogContentText>[D] - Delete mode</DialogContentText>
        <DialogContentText>[M] - Move mode</DialogContentText>
        <DialogContentText>[C] - Open color picker</DialogContentText>
        <DialogContentText>[Arrows] - Move the camera</DialogContentText>
        <DialogContentText>[+/-] - Zoom in/out</DialogContentText>
        <DialogContentText>[Space] - Interact</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
