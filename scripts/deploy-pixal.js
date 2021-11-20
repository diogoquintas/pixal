const { ethers } = require("hardhat");

async function main() {
  const Pixal = await ethers.getContractFactory("Pixal");
  const pixal = await Pixal.deploy();

  await pixal.deployed();

  console.log("Contract created:", {
    contractAddress: pixal.address,
    transactionHash: pixal.deployTransaction.hash,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
