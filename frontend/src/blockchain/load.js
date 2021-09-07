import Web3 from "../../node_modules/web3/dist/web3.min.js";
import contractData from "../../../build/contracts/Painting.json";

const CONTRACT_ADDRESS = "0xa893cdF112F797648a425C591A1Bcdf482A82FF0";
export const BASE_VALUE = 1;

function loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  }
}

async function loadContract() {
  window.contract = await new window.web3.eth.Contract(
    contractData.abi,
    CONTRACT_ADDRESS
  );
}

export async function loadAccount() {
  try {
    const accounts = await window.web3.eth.getAccounts();

    window.account = accounts[0];
  } catch {
    alert(
      "error getting an account, make sure you're correctly connected with a wallet"
    );
  }
}

export async function loadBoard(callback) {
  const timeout = setTimeout(() => {
    callback([]);
  }, 10000);
  const pixels = await window.contract.methods._getPixels().call();

  clearTimeout(timeout);
  callback(pixels);
}

export default async function load(callback) {
  loadWeb3();

  try {
    await loadContract();
  } catch (e) {
    console.log(e);
  }

  try {
    await loadBoard(callback);
  } catch (e) {
    console.log(e);
  }
}
