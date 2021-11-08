const { ethers, upgrades } = require("hardhat");

const PAINTING_ADDRESS = "0x0ddb7c78df1e65098dcf25f015cead588b4ccc55";

async function main() {
  const Painting = await ethers.getContractFactory("Painting");

  await upgrades.upgradeProxy(PAINTING_ADDRESS, Painting);

  console.log("Painting upgraded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
