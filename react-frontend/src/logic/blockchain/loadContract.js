import contractAbi from "./contractAbi.json";

export default async function loadContract() {
  window.contract = await new window.web3.eth.Contract(
    contractAbi,
    process.env.REACT_APP_CONTRACT_ADDRESS
  );
}
