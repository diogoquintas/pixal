const { ethers, upgrades } = require("hardhat");

async function main() {
  const Painting = await ethers.getContractFactory("Painting");
  const painting = await upgrades.deployProxy(Painting);

  await painting.deployed();

  console.log("Contract created:", {
    contractAddress: painting.address,
    transactionHash: painting.deployTransaction.hash,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
