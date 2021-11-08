export default async function loadAccount() {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
    params: [
      {
        chainId: window.web3.utils.toHex(process.env.REACT_APP_CHAIN_ID),
      },
    ],
  });

  window.account = accounts[0];
}
