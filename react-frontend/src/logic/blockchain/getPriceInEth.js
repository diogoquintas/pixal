import { getPixelPrice } from "../../components/pixel-list/PixelList";

export function fromWei(wei) {
  return window.web3.utils.fromWei(`${wei}`);
}

export default function getPriceInEth(timesPainted) {
  return fromWei(getPixelPrice(timesPainted));
}
