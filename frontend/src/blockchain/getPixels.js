export async function getPixels() {
  window.pixels = await window.contract.methods._getPixels().call();
}
