import Web3 from "../../node_modules/web3/dist/web3.min.js";
import contractData from "../../../build/contracts/Painting.json";
import { getPixels } from "./getPixels.js";
import { firstDraw, savePoint } from "../app.js";
import { storageGetPoints } from "../storage/pointsStorage.js";

const CONTRACT_ADDRESS = "0x362329EE1C42DbAd0d192802739b25341D56dAca";

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

function loadStoragePoints() {
  const storagePoints = storageGetPoints();

  Object.entries(storagePoints).forEach(([id, color]) => {
    const [x, y] = id.split("-");

    savePoint({ x: Number(x), y: Number(y), color, size: 1, addToBag: false });
  });
}

export default async function load() {
  loadWeb3();

  try {
    await loadContract();
  } catch {
    alert(
      "error reading blockchain data, make sure you're correctly connected to a wallet"
    );
  }

  try {
    await getPixels();
    firstDraw();
    loadStoragePoints();
  } catch {
    alert("error on fetching pixels");
  }
}
