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
          <DialogTitle>WHAT IS THIS?</DialogTitle>
          <DialogContentText>
            This application interacts with an open and permissionless canvas,
            distribuited and stored in the{" "}
            <a href="https://ethereum.org/" target="_blank" rel="noreferrer">
              Ethereum blockchain
            </a>
            .
          </DialogContentText>
          <DialogContentText>
            Each pixel can be painted on any color you like, for whatever reason
            you find.
          </DialogContentText>
          <DialogContentText>
            The canvas is a square with one thousand pixels wide.
          </DialogContentText>
          <DialogContentText>
            There's no clear goal to this, it was made for fun, interact with it
            at your own risk.
          </DialogContentText>
          <DialogContentText>
            <span>The blockchain logic is stored in </span>
            <a
              href={`${process.env.REACT_APP_CONTRACT_EXPLORER}${process.env.REACT_APP_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
            >
              this contract
            </a>
            <span>.</span>
            <span>
              {" "}
              Before any interaction, make sure you read the code. This contract
              was not audited and could lead to exploits.
            </span>
          </DialogContentText>

          <DialogTitle>PIXELNOMICS</DialogTitle>
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
