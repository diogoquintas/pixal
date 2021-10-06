import getPixels from "../../logic/blockchain/getPixels";
import paint from "../../logic/blockchain/paint";
import { Control } from "../pixel-list/PixelList.styles";

export default function PaintButton({
  transacting,
  setTransacting,
  pixels,
  setAlert,
  deleteAll,
  drawMap,
  chainPixelsAsList,
}) {
  return (
    <Control
      variant="outlined"
      disabled={transacting}
      onClick={async () => {
        setTransacting(true);
        setAlert(undefined);

        try {
          await paint(pixels);

          chainPixelsAsList.current = await getPixels();
          drawMap({ updateImage: true });

          deleteAll();
          setTransacting(false);

          setAlert({
            msg: "Congrats on your transaction!",
            severity: "success",
          });

          setTimeout(() => setAlert(undefined), 3000);
        } catch (err) {
          console.log(err);

          setAlert({
            msg: "An error happened processing your transaction, please check if your wallet and account are correctly connected.",
            severity: "error",
          });
          setTransacting(false);
        }
      }}
    >
      {transacting ? "Painting on-chain" : "Paint on-chain"}
    </Control>
  );
}
