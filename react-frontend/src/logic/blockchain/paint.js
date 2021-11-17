const MAX_PIXELS_PER_TRANSACTION = Number(
  process.env.REACT_APP_MAX_PIXELS_PER_TRANSACTION
);

export default function paint({ pixelList, setAlert }) {
  const pixels = pixelList.map(({ x, y, color }) => [
    x,
    y,
    color.replace("#", "0x"),
  ]);

  let currentBatch = 0;

  const batches = pixels.reduce((acc, pixel, index) => {
    const price = Number(pixelList[index].price);

    if (acc[currentBatch]) {
      acc[currentBatch].value = acc[currentBatch].value + price;
      acc[currentBatch].pixels.push(pixel);
    } else {
      acc[currentBatch] = {
        value: price,
        pixels: [pixel],
      };
    }

    if (acc[currentBatch].pixels.length === MAX_PIXELS_PER_TRANSACTION) {
      currentBatch++;
    }

    return acc;
  }, []);

  setAlert({
    severity: "info",
    dismissibleTime: 6000,
    title: (
      <>
        <p>{`>_Found ${batches.length} transaction${
          batches.length > 1 ? "s" : ""
        } and they are ready to be processed on-chain. Complete the next step in your wallet.`}</p>
      </>
    ),
  });

  return Promise.all(
    batches.map((batch) =>
      window.contract.methods.paint(batch.pixels).send({
        from: window.account,
        value: batch.value.toString(),
      })
    )
  );
}
