import { ErrorPre } from "../../App.styles";
import loadAccount from "../../logic/blockchain/loadAccount";
import paint from "../../logic/blockchain/paint";
import { Control } from "../pixel-list/PixelList.styles";

export default function PaintButton({
  transacting,
  setTransacting,
  pixels,
  setAlert,
}) {
  return (
    <Control
      variant="contained"
      disabled={transacting}
      onClick={async () => {
        setTransacting(true);
        setAlert(undefined);

        try {
          await loadAccount();
          await paint(pixels);

          setTransacting(false);

          setAlert({
            msg: ">_done! congrats on your painting skills",
            severity: "success",
            dismissibleTime: 3000,
          });
        } catch (err) {
          setAlert({
            msg: <ErrorPre>{err.message}</ErrorPre>,
            title:
              ">_an error occurred in one of your transactions, please check if your wallet and account are correctly connected.",
            severity: "error",
          });
          setTransacting(false);
        }
      }}
    >
      {transacting ? "Painting" : "Paint"}
    </Control>
  );
}
