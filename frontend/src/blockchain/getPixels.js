export async function getPixels() {
  return window.contract.methods._getPixels().call();
}
