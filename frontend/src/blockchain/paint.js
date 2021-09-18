export const MAX_PER_BATCH = 50;

export default function paint(points) {
  const pixels = points.map(({ x, y, color, offer }) => [color, offer, [x, y]]);

  let currentBatch = 0;

  const batches = pixels.reduce((acc, pixel) => {
    if (acc[currentBatch]) {
      acc[currentBatch].offer = acc[currentBatch].offer + pixel[1];
      acc[currentBatch].pixels.push(pixel);
    } else {
      acc[currentBatch] = {
        offer: pixel[1],
        pixels: [pixel],
      };
    }

    if (acc[currentBatch].pixels.length === MAX_PER_BATCH) {
      currentBatch++;
    }

    return acc;
  }, []);

  return Promise.all(
    batches.map((batch) =>
      window.contract.methods._paintPixels(batch.pixels).send({
        from: window.account,
        value: batch.offer,
      })
    )
  );
}
