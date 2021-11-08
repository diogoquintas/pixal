const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Painting", function () {
  it("Should paint", async function () {
    const Painting = await ethers.getContractFactory("Painting");
    const painting = await upgrades.deployProxy(Painting);

    await painting.deployed();

    // expect(await painting.length()).to.equal(0);

    // const paintTx = await painting.paint([[999, 999, "0x0000FF"]]);

    // // wait until the transaction is mined
    // await paintTx.wait();

    // expect(await painting.list(1, 1)).to.equal([
    //   [999, 999, 1, "0x0000FF", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
    // ]);
  });
});
