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
          <DialogTitle>What is this?</DialogTitle>
          <DialogContentText>
            This is an interactive painting for everyone. It is a square canvas
            which measures 400x400 pixels. Every pixel can be painted, selecting
            a specific color.{" "}
          </DialogContentText>
          <DialogContentText>
            The cool part is that the canvas is yours, it's out there,
            distributed, more specifically, in the{" "}
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
              href={`${process.env.REACT_APP_CONTRACT_EXPLORER}/address/${process.env.REACT_APP_CONTRACT_ADDRESS}`}
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
            Every time a pixel is painted, the previous author of that pixel (if
            it exists) will receive three quarters of the amount payed to
            re-paint the pixel.
          </DialogContentText>
          <DialogTitle>Experimental version</DialogTitle>
          <DialogContentText>
            This interface is currently on an early experimental version. We're
            working out some compatibility issues across devices and browsers as
            well as different wallets. For now, we recommend you to access the
            application in a desktop using Chrome/Brave with the Metamask
            extension.
          </DialogContentText>
          <DialogTitle>
            any question, reach out to us on{" "}
            <a
              href="https://twitter.com/pixalproject"
              target="_blank"
              rel="noreferrer"
            >
              twitter
            </a>
          </DialogTitle>
        </DialogContent>
      </Dialog>
    </>
  );
}
