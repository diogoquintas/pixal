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
            welcome, this is an interface to a contract in the{" "}
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
            The contract is deployed in Arbitrum. If you never interacted with
            it, follow this{" "}
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
            it works as a painting where the color of each pixel is stored in
            the blockchain.
          </DialogContentText>
          <DialogContentText>
            everyone can paint and the limit is your imagination (and also the
            boundaries of the painting which is 1000x1000px).
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
          <DialogTitle>remember, wagmi. the canvas is yours!</DialogTitle>
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
