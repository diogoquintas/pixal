import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function HelpDialog(props) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogTitle>stances</DialogTitle>
        <DialogContentText>
          There are 3 modes which are represented by the cursor, erasor and
          pencil icons, they are move, delete and paint, respectably.
        </DialogContentText>
        <DialogContentText>
          In the first mode you can move around with your
          mouse/trackpad/touchpad or touchscreen and select painted pixels by
          clicking them.
        </DialogContentText>
        <DialogContentText>
          In the second you can delete the pixels that you painted and haven't
          been sent to the chain.
        </DialogContentText>
        <DialogContentText>
          In the third you can paint the canvas with the selected color and
          size.
        </DialogContentText>
        <DialogTitle>KEYBOARD CONTROLS</DialogTitle>
        <DialogContentText>[P] - Paint mode</DialogContentText>
        <DialogContentText>[D] - Delete mode</DialogContentText>
        <DialogContentText>[M] - Move mode</DialogContentText>
        <DialogContentText>[C] - Open color picker</DialogContentText>
        <DialogContentText>[Arrows] - Move the camera</DialogContentText>
        <DialogContentText>[+/-] - Zoom in/out</DialogContentText>
        <DialogContentText>[Space] - Interact</DialogContentText>
        <DialogTitle>🚀</DialogTitle>
        <DialogContentText>
          After your masterpiece is done, you can paint it on chain for everyone
          to see by sending your transaction(s).
        </DialogContentText>
        <DialogContentText>{`Each transaction can contain ${process.env.REACT_APP_MAX_PIXELS_PER_TRANSACTION} pixels.`}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
