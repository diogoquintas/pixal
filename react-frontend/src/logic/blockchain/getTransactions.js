export default async function getTransactions(options) {
  const {
    pixels,
    pixelsPrice,
    startIndex = 0,
    endIndex = pixels.length,
    transactions = [],
    precision = 5,
    iteration = 1,
  } = options ?? {};

  console.log("start", options);

  const target = pixels.slice(startIndex, endIndex);
  const value = target.reduce(
    (acc, pixel, index) => acc + pixelsPrice[index],
    0
  );

  let gas = 0;

  try {
    gas = await window.contract.methods.paintPixels(target).estimateGas({
      value,
      from: window.account,
    });

    console.log("found gas", options);
  } catch (err) {
    console.log("looking bellow", options);

    // TODO: maybe check if is `-32000` (out of gas)
    await getTransactions({
      pixels,
      pixelsPrice,
      startIndex,
      endIndex: startIndex + Math.round(target.length / 2),
      transactions,
      precision,
      iteration: iteration + 1,
    });
  }

  if (iteration >= precision || pixels.length === target.length) {
    console.log("found transaction", options);

    transactions.push({
      pixels: target,
      value,
      gas,
    });

    if (
      pixels.length ===
      transactions.reduce(
        (acc, transaction) => acc + transaction.pixels.length,
        0
      )
    ) {
      console.log("returning transactions", transactions);

      return transactions;
    } else {
      console.log("getting next transaction");

      await getTransactions({
        pixels,
        pixelsPrice,
        startIndex: startIndex + target.length,
        endIndex: pixels.length,
        transactions,
        precision,
        iteration: 1,
      });
    }
  } else {
    console.log("looking ahead", options);

    await getTransactions({
      pixels,
      pixelsPrice,
      startIndex,
      endIndex: startIndex + target.length + Math.round(target.length / 2),
      transactions,
      precision,
      iteration: iteration + 1,
    });
  }
}
