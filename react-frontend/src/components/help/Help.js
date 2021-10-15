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
          <DialogTitle>gm</DialogTitle>
          <DialogContentText>
            You have a canvas with 1000x1000 pixels wide. Every pixel can be
            painted on a different color, you can paint them all or you can
            paint none, that's up to you.
          </DialogContentText>
          <DialogContentText>
            The canvas lives in the{" "}
            <a href="https://ethereum.org/" target="_blank" rel="noreferrer">
              Ethereum blockchain
            </a>{" "}
            , more precisely in{" "}
            <a
              href={`${process.env.REACT_APP_CONTRACT_EXPLORER}${process.env.REACT_APP_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
            >
              this contract
            </a>
            .
          </DialogContentText>
          <DialogContentText>
            If you wish to interact, make sure you read the code. This contract
            was not audited.
          </DialogContentText>
          <DialogContentText>
            We use Arbitrum as a solution to the high gas fees in layer one. If
            you never interacted with it, follow this{" "}
            <a
              href="https://arbitrum.io/bridge-tutorial/"
              target="_blank"
              rel="noreferrer"
            >
              Arbitrum bridge tutorial
            </a>{" "}
            to connect.
          </DialogContentText>
          <DialogTitle>wagmi?</DialogTitle>
          <DialogContentText>yes, wagmi.</DialogContentText>
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

          <DialogTitle>the canvas is yours</DialogTitle>

          <DialogTitle>links</DialogTitle>
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
