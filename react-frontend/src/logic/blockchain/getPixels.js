export default function getPixels() {
  return window.contract.methods.pixelsInfo().call();
}
