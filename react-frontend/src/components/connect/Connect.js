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
import { ConnectButton, ButtonWrapper } from "./Connect.styles";
import ErrorInfo from "../error-info/ErrorInfo";
import isMobileDevice from "../../logic/isMobileDevice";

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
  loadChainPixels,
}) {
  const [connecting, setConnecting] = useState(false);
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
        if (isMobileDevice()) {
          window
            .open(
              `metamask://${process.env.REACT_APP_METAMASK_DEEPLINK}`,
              "_blank"
            )
            .focus();
        } else {
          throw new Error("no ethereum injected");
        }
      } else {
        await provider.enable();
      }

      window.web3 = new Web3(provider);
      await loadChainInfo();
    } catch {
      setShowWalletModal(true);
      setConnecting(false);

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
                  &gt;_There was an error reading the blockchain data, make sure
                  you're connected to the correct network. We're on Arbitrum,
                  follow this link to{" "}
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

      return;
    }

    loadChainPixels();
    setConnected(true);
  };

  return (
    <>
      <ButtonWrapper>
        <ConnectButton loading={connecting} onClick={connect}>
          Enter with your wallet
        </ConnectButton>
        <Help />
      </ButtonWrapper>
      <Dialog open={showWalletModal}>
        <DialogTitle>Please install a wallet</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Currently, we support{" "}
            <a target="_blank" rel="noreferrer" href="https://metamask.io/">
              Metamask
            </a>
            .{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWalletModal(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
