import { ErrorPre } from "../../App.styles";
import loadAccount from "../../logic/blockchain/loadAccount";
import paint from "../../logic/blockchain/paint";
import { Control } from "../pixel-list/PixelList.styles";

export default function PaintButton({
  transacting,
  setTransacting,
  pixelList,
  setAlert,
  ...remainingProps
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
          await paint({ pixelList, setAlert });

          setTransacting(false);

          setAlert({
            msg: ">_congratulations! your pixels are now saved in the blockchain 🥳",
            severity: "success",
            dismissibleTime: 3000,
          });
        } catch (err) {
          setAlert({
            msg: (
              <>
                <p>detailed info:</p>
                <ErrorPre>{err.message}</ErrorPre>
              </>
            ),
            title:
              ">_an error occurred in one of your transactions, please check if your wallet and account are correctly connected.",
            severity: "error",
          });
          setTransacting(false);
        }
      }}
      {...remainingProps}
    >
      {transacting ? "Painting" : "Paint"}
    </Control>
  );
}
