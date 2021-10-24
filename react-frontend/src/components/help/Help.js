import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { HelpButton } from "./Help.styles";

export default function Help() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <HelpButton
        variant="outlined"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        ?
      </HelpButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogTitle>what is this</DialogTitle>
          <DialogContentText>
            it is an interface to a contract in the{" "}
            <a href="https://ethereum.org/" target="_blank" rel="noreferrer">
              Ethereum blockchain
            </a>
            .{" "}
          </DialogContentText>
          <DialogContentText>
            You can and should read{" "}
            <a
              href={`${process.env.REACT_APP_CONTRACT_EXPLORER}${process.env.REACT_APP_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
            >
              the code
            </a>{" "}
            before interacting with it. This contract was not audited.
          </DialogContentText>
          <DialogContentText>
            The contract was deployed in Arbitrum. It is a solution to the high
            gas fees in layer one of Ethereum. If you never interacted with it,
            follow this{" "}
            <a
              href="https://arbitrum.io/bridge-tutorial/"
              target="_blank"
              rel="noreferrer"
            >
              Arbitrum bridge tutorial
            </a>{" "}
            to connect.
          </DialogContentText>
          <DialogTitle>The contract</DialogTitle>
          <DialogContentText>
            It saves a color code for each coordinate of a 1000x1000 pixel wide
            board.
          </DialogContentText>
          <DialogContentText>
            It is open to everyone and there's no limit to the number of pixels
            you can paint.
          </DialogContentText>
          <DialogContentText>
            The price of each pixel starts at 0 ETH and it increases
            exponentially each time it is painted.
          </DialogContentText>
          <DialogContentText>
            The formula to calculate the price of a pixel is:
          </DialogContentText>
          <DialogContentText>
            Price = 0.00001 ETH * 10^t, where 't' is the times it was previously
            painted.
          </DialogContentText>
          <DialogContentText>
            The price is capped at t = 11, in other words, the maximum price a
            pixel can have is 1.000.000 ETH.
          </DialogContentText>
          <DialogContentText>
            Every time a pixel is painted, the previous owner of that pixel (if
            it exists) will receive three quarters of the amount payed to
            re-paint the pixel.
          </DialogContentText>
          <DialogTitle>
            remember, the canvas is yours and also, wagmi.
          </DialogTitle>
          <DialogContentText>
            <a href="https://fontawesome.com/" target="_blank" rel="noreferrer">
              Icons
            </a>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
