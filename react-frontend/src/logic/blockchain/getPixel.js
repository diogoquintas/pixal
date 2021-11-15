export default function getPixel(x, y) {
  return window.contract.methods.details(x, y).call();
}
