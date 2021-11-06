export default function getPixel(x, y) {
  return window.contract.methods.pixel(x, y).call();
}
