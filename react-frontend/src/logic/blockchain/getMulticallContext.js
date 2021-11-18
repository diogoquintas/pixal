import abi from "./abi.json";

export default function getMulticallContext({ methodName, params }) {
  return {
    reference: "Painting",
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
    abi,
    calls: params.map((param, index) => ({
      reference: `methodName${index}`,
      methodName,
      methodParameters: param,
    })),
  };
}
