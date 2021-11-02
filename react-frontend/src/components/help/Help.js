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
      <HelpButton variant="outlined" onClick={() => setOpen(true)}>
        ?
      </HelpButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogTitle>GM</DialogTitle>
          <DialogContentText>
            We're working out some compatibility issues across devices and
            browsers. For now, we recommend the use of desktop browser
            Chrome/Brave with the Metamask extension.
          </DialogContentText>
          <DialogTitle>What is this?</DialogTitle>
          <DialogContentText>
            This is an interactive painting. It is a square which measures
            1000x1000 pixels. Every pixel can be painted, selecting a specific
            color.{" "}
          </DialogContentText>{" "}
          <DialogContentText>
            If you're a reddit fan, this is a cousin of /R/place for web 3.0.
          </DialogContentText>
          <DialogContentText>
            The painting is stored and distributed by the{" "}
            <a href="https://ethereum.org/" target="_blank" rel="noreferrer">
              Ethereum blockchain
            </a>
            .{" "}
          </DialogContentText>{" "}
          <DialogTitle>Rules</DialogTitle>
          <DialogContentText>
            The blank space is free. Unleash your creativity.
          </DialogContentText>
          <DialogContentText>
            As a sign of respect to the person who painted before you, if you
            want to repaint a pixel you need to pay.
          </DialogContentText>
          <DialogContentText>
            75% of that value goes to the previous painter.
          </DialogContentText>
          <DialogContentText>
            <a
              href={`${process.env.REACT_APP_CONTRACT_EXPLORER}${process.env.REACT_APP_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
            >
              The contract
            </a>{" "}
            is fairly simple but you should still read it before painting. It
            was not audited.
          </DialogContentText>
          <DialogContentText>
            It was deployed in Arbitrum. In case this is your first time
            connecting to Arbitrum, follow this{" "}
            <a
              href="https://arbitrum.io/bridge-tutorial/"
              target="_blank"
              rel="noreferrer"
            >
              Arbitrum bridge tutorial
            </a>
            .
          </DialogContentText>
          <DialogTitle>Pixelnomics</DialogTitle>
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
