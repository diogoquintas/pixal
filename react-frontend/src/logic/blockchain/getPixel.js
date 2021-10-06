export default function getPixel(x, y) {
  return window.contract.methods.pixelInfo([x, y]).call();
}
