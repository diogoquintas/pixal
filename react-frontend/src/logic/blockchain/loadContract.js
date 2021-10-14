import abi from "./abi.json";

export default async function loadContract() {
  window.contract = await new window.web3.eth.Contract(
    abi,
    process.env.REACT_APP_CONTRACT_ADDRESS
  );
}
