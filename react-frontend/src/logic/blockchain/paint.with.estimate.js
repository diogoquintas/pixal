import getTransactions from "./getTransactions";

export default async function paint({ pixelList, setAlert }) {
  const pixelsPrice = [];
  const pixels = pixelList.map(({ price, color, x, y }) => {
    pixelsPrice.push(price);

    return [x, y, color.replace("#", "0x")];
  });

  setAlert({
    severity: "info",
    dismissibleTime: 4000,
    title: (
      <>
        <p>{`>_Calculating the number of transactions and the gas required...`}</p>
      </>
    ),
  });

  const transactions = await getTransactions(
    {
      pixels,
      pixelsPrice,
    },
    setAlert
  );

  setAlert({
    severity: "info",
    dismissibleTime: 6000,
    title: (
      <>
        <p>{`>_Found ${transactions.length} transaction${
          transactions.length > 1 ? "s" : ""
        }. Ready to send it to the blockchain, complete the next step in your wallet.`}</p>
      </>
    ),
  });

  return Promise.all(
    transactions.map((transaction) =>
      window.contract.methods.paintPixels(transaction.pixels).send({
        from: window.account,
        value: transaction.value.toString(),
        gas: transaction.gas,
      })
    )
  );
}
