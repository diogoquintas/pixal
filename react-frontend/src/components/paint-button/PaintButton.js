import loadAccount from "../../logic/blockchain/loadAccount";
import paint from "../../logic/blockchain/paint";
import ErrorInfo from "../error-info/ErrorInfo";
import { Control } from "../pixel-list/PixelList.styles";

export default function PaintButton({
  transacting,
  setTransacting,
  pixelList,
  setAlert,
  onViewOnly,
  ...remainingProps
}) {
  return (
    <Control
      variant="contained"
      disabled={transacting || onViewOnly}
      onClick={async () => {
        setTransacting(true);
        setAlert(undefined);

        try {
          await loadAccount();
          await paint({ pixelList, setAlert });
        } catch (err) {
          setAlert({
            msg: <ErrorInfo>{err.message}</ErrorInfo>,
            title:
              ">_An error occurred in one of your transactions. Don't worry, your contribution is stored in your device, check your wallet for any error and try again.",
            severity: "error",
          });
          setTransacting(false);
        }
      }}
      {...remainingProps}
    >
      {transacting ? "Processing transactions..." : "Paint"}
      {onViewOnly && " (view only)"}
    </Control>
  );
}
