const MAX_PIXELS_PER_TRANSACTION = Number(
  process.env.REACT_APP_MAX_PIXELS_PER_TRANSACTION
);

export default function paint(initialPixels) {
  const pixels = initialPixels.map(({ x, y, color, price }) => [color, [x, y]]);

  let currentBatch = 0;

  const batches = pixels.reduce((acc, pixel, index) => {
    if (acc[currentBatch]) {
      acc[currentBatch].value =
        acc[currentBatch].value + initialPixels[index].price;
      acc[currentBatch].pixels.push(pixel);
    } else {
      acc[currentBatch] = {
        value: initialPixels[index].price,
        pixels: [pixel],
      };
    }

    if (acc[currentBatch].pixels.length === MAX_PIXELS_PER_TRANSACTION) {
      currentBatch++;
    }

    return acc;
  }, []);

  return Promise.all(
    batches.map((batch) =>
      window.contract.methods.paintPixels(batch.pixels).send({
        from: window.account,
        value: batch.value,
      })
    )
  );
}
