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
            This is an experiment. We're still working out some compability
            issues across devices and browsers. For now, we recommend you to use
            Desktop Chrome/Brave with the Metamask extension.
          </DialogContentText>
          <DialogTitle>what is this</DialogTitle>
          <DialogContentText>
            This is a interactive painting with a square shape and 1000 pixels
            wide. Every pixel of the painting can be painted with a color.{" "}
          </DialogContentText>
          <DialogContentText>
            If you're a fan of Reddit, this is /r/place cousin for web 3.0.
          </DialogContentText>{" "}
          <DialogContentText>
            The painting is stored and distributed by the{" "}
            <a href="https://ethereum.org/" target="_blank" rel="noreferrer">
              Ethereum blockchain
            </a>
            .{" "}
          </DialogContentText>{" "}
          <DialogContentText>
            In order to prevent people from just ruining others people pixels,
            you have to pay a price to re-paint a pixel. Most of that value is
            then sent to the previous painter.
          </DialogContentText>
          <DialogContentText>
            <a
              href={`${process.env.REACT_APP_CONTRACT_EXPLORER}${process.env.REACT_APP_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
            >
              the contract
            </a>{" "}
            is fairly simple but you should still read it before interacting
            with it. It was not audit.
          </DialogContentText>
          <DialogContentText>
            It was deployed in Arbitrum. If you never connected to it, follow
            this{" "}
            <a
              href="https://arbitrum.io/bridge-tutorial/"
              target="_blank"
              rel="noreferrer"
            >
              Arbitrum bridge tutorial
            </a>{" "}
            to connect.
          </DialogContentText>
          <DialogTitle>pixelnomics</DialogTitle>
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
          <DialogTitle>
            {" "}
            <a
              href="https://twitter.com/pixalproject"
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
          </DialogTitle>
        </DialogContent>
      </Dialog>
    </>
  );
}
