export default async function loadAccount() {
  const accounts = await window.web3.eth.getAccounts();

  window.account = accounts[0];
}
