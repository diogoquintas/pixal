import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Item, List } from "./PixelList.styles";

export default function ListDialog({ pixels, onClose, open }) {
  return (
    <Dialog open={open}>
      <DialogTitle>Your directory:\</DialogTitle>
      <DialogContent>
        <List>
          {pixels.map(({ id, color, x, y }) => (
            <Item key={id}>
              <DialogContentText>{`<x:${x}, y:${y}>`}</DialogContentText>
              <DialogContentText>{`color: ${color}`}</DialogContentText>
            </Item>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onClose}>Paint</Button>
      </DialogActions>
    </Dialog>
  );
}
