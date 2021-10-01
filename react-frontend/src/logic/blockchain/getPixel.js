export default function getPixel(x, y) {
  return window.contract.methods._getPixel([x, y]).call();
}
