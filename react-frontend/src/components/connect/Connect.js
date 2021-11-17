import { useState } from "react";
import Web3 from "web3";
import loadAccount from "../../logic/blockchain/loadAccount";
import loadContract from "../../logic/blockchain/loadContract";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Help from "../help/Help";
import { ConnectButton, ViewButton, ButtonWrapper } from "./Connect.styles";
import ErrorInfo from "../error-info/ErrorInfo";

export const CHAIN_PARAMS = {
  chainId: process.env.REACT_APP_CHAIN_ID,
  chainName: process.env.REACT_APP_CHAIN_NAME,
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: [process.env.REACT_APP_CHAIN_RPC_URL],
  blockExplorerUrls: [process.env.REACT_APP_CONTRACT_EXPLORER],
};

export default function Connect({
  setAlert,
  setConnected,
  updateChainPixel,
  setOnViewOnly,
  loadChainPixels,
}) {
  const [connecting, setConnecting] = useState(false);
  const [connectingAsViewer, setConnectingAsViewer] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const setErrorAlert = ({ err, title }) => {
    setAlert({
      msg: <ErrorInfo>{err.message}</ErrorInfo>,
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
      await loadChainInfo();
      setOnViewOnly(false);
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
      await loadChainInfo();
      setOnViewOnly(true);
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
  };

  const loadChainInfo = async () => {
    const isCorrectNetwork =
      window.ethereum.networkVersion === process.env.REACT_APP_CHAIN_ID;

    if (!isCorrectNetwork) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: window.web3.utils.toHex(process.env.REACT_APP_CHAIN_ID),
            },
          ],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [CHAIN_PARAMS],
            });
          } catch (err) {
            setErrorAlert({
              err,
              title: (
                <>
                  &gt;_There was an error connecting to your account, make sure
                  you have an account selected
                </>
              ),
            });
            setConnecting(false);
            setConnectingAsViewer(false);
            return;
          }
        }
      }
    }

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

      window.contract.events.PixelPainted(undefined, updateChainPixel);
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

    loadChainPixels();
    setConnected(true);
  };

  return (
    <>
      <ButtonWrapper>
        <ConnectButton
          variant="outlined"
          loading={connecting}
          onClick={connect}
        >
          Enter with your wallet
        </ConnectButton>
        <ViewButton
          variant="outlined"
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
