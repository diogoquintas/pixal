const pageSize = Number(process.env.REACT_APP_MAX_PIXELS_PER_PAGE);

export default async function getPixels() {
  const pixelCount = await window.contract.methods.length().call();
  const totalPages = Math.ceil(Number(pixelCount) / pageSize);

  const pages = await Promise.all(
    Array.from({ length: totalPages }).map((_, index) =>
      window.contract.methods.list(index + 1, pageSize).call()
    )
  );

  return pages.flat();
}
