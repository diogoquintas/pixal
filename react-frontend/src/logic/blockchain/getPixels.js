export default function getPixels() {
  return window.contract.methods._getPixels().call();
}
