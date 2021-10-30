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
import { ErrorPre } from "../../App.styles";
import Help from "../help/Help";
import { ConnectButton, ViewButton, ButtonWrapper } from "./Connect.styles";

export default function Connect({
  setAlert,
  setPixelsToLoad,
  updateChainPixel,
}) {
  const [connecting, setConnecting] = useState(false);
  const [connectingAsViewer, setConnectingAsViewer] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const setErrorAlert = ({ err, title }) => {
    setAlert({
      msg: (
        <>
          <p>detailed info:</p>
          <ErrorPre>{err.message}</ErrorPre>
        </>
      ),
      title,
      severity: "error",
    });
  };

  const connect = async () => {
    setAlert(undefined);
    setConnecting(true);

    try {
      const provider = window.ethereum;

      if (!window.ethereum) {
        throw new Error("no ethereum injected");
      } else {
        await provider.enable();
      }

      window.web3 = new Web3(provider);
      loadChainInfo();
    } catch {
      setShowWalletModal(true);
      setConnecting(false);

      return;
    }
  };

  const connectAsViewer = async () => {
    setAlert(undefined);
    setConnectingAsViewer(true);

    try {
      const provider = new Web3.providers.HttpProvider(
        process.env.REACT_APP_INFURA_ENDPOINT
      );

      window.web3 = new Web3(provider);
      loadChainInfo();
    } catch {
      setShowWalletModal(true);
      setConnectingAsViewer(false);

      return;
    }
  };

  const loadChainInfo = async () => {
    try {
      await loadAccount();
    } catch (err) {
      setErrorAlert({
        err,
        title: (
          <>
            &gt;_There was an error connecting to your account, make sure you
            have an account selected
          </>
        ),
      });
      setConnecting(false);
      setConnectingAsViewer(false);
      return;
    }

    try {
      await loadContract();
    } catch (err) {
      setConnecting(false);
      setConnectingAsViewer(false);
      return;
    }

    try {
      const pixels = await getPixels();

      setPixelsToLoad(pixels ?? []);
    } catch (err) {
      setErrorAlert({
        err,
        title: (
          <>
            &gt;_There was an error reading the blockchain data, make sure
            you're connected to the correct network. We're on Arbitrum, follow
            this link to{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://arbitrum.io/bridge-tutorial/"
            >
              connect to the chain
            </a>
            .
          </>
        ),
      });
      setConnecting(false);
      setConnectingAsViewer(false);
      return;
    }

    window.contract.events.PixelPainted(undefined, updateChainPixel);

    setConnecting(false);
    setConnectingAsViewer(false);
  };

  return (
    <>
      <ButtonWrapper>
        <ConnectButton
          color="primary"
          variant="outlined"
          loading={connecting}
          onClick={connect}
        >
          Enter with your wallet
        </ConnectButton>
        <ViewButton
          color="primary"
          variant="contained"
          loading={connectingAsViewer}
          onClick={connectAsViewer}
        >
          Enter as a viewer
        </ViewButton>
        <Help />
      </ButtonWrapper>
      <Dialog open={showWalletModal}>
        <DialogTitle>Please install a wallet</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We recommend you use{" "}
            <a target="_blank" rel="noreferrer" href="https://metamask.io/">
              Metamask
            </a>
            .{" "}
          </DialogContentText>
          <DialogContentText>
            If your browser does not support metamask or you're using a mobile
            device you can enter as a viewer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWalletModal(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
