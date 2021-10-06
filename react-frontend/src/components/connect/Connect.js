import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import Web3 from "web3";
import getPixels from "../../logic/blockchain/getPixels";
import loadAccount from "../../logic/blockchain/loadAccount";
import loadContract from "../../logic/blockchain/loadContract";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export default function Connect({ setAlert, chainPixelsAsList, setConnected }) {
  const [connecting, setConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const connect = async () => {
    setAlert(undefined);
    setConnecting(true);

    try {
      if (isMobileDevice()) {
        window.location.replace(
          `metamask://${process.env.REACT_APP_METAMASK_DEEP_LINK}`
        );

        window.setTimeout(() => {
          setShowWalletModal(false);
          setConnecting(false);
        }, 3000);
      }

      if (!window.ethereum) throw new Error("no provider injected");

      await window.ethereum.enable();
      window.web3 = new Web3(window.ethereum);
      loadChainInfo();
    } catch {
      setShowWalletModal(true);
      setConnecting(false);

      return;
    }
  };

  const loadChainInfo = async () => {
    try {
      await loadAccount();
    } catch (err) {
      console.log(err);
      setAlert({
        msg: (
          <p>
            There was an error connecting to your account, make sure you have an
            account selected
          </p>
        ),
        severity: "error",
      });
      setConnecting(false);
      return;
    }

    try {
      await loadContract();
    } catch (err) {
      console.log(err);
      setAlert({
        msg: (
          <p>
            There was an error reading the blockchain data, make sure you're
            connected to the correct network. We currently use Arbitrum for
            faster and cheaper connections, follow this link to{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://developer.offchainlabs.com/docs/public_testnet#connecting-to-the-chain"
            >
              connect to the chain
            </a>
            .
          </p>
        ),
        severity: "error",
      });
      setConnecting(false);
      return;
    }

    try {
      chainPixelsAsList.current = await getPixels();
    } catch (err) {
      console.log(err);
      setAlert({
        msg: (
          <p>
            There was an error fetching the pixels, make sure you're connected
            to the correct network. We currently use Arbitrum for faster and
            cheaper connections, follow this link to{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://developer.offchainlabs.com/docs/public_testnet#connecting-to-the-chain"
            >
              connect to the chain
            </a>
            .
          </p>
        ),
        severity: "error",
      });
      setConnecting(false);
      return;
    }

    setConnected(true);
    setConnecting(false);
  };

  return (
    <>
      <LoadingButton
        color="secondary"
        variant="contained"
        loading={connecting}
        onClick={connect}
      >
        Connect
      </LoadingButton>
      <Dialog open={showWalletModal}>
        <DialogTitle>Please install a wallet</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We recommend you use{" "}
            <a target="_blank" rel="noreferrer" href="https://metamask.io/">
              Metamask
            </a>{" "}
            since it's the wallet we currently support. Other wallets could lead
            to malfunction.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWalletModal(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
