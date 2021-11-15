export default function getPixels(x0, y0, x1, y1) {
  return window.contract.methods.list(x0, y0, x1, y1).call();
}
