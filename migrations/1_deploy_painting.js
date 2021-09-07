const Painting = artifacts.require("Painting");

module.exports = function (deployer) {
  deployer.deploy(Painting);
};
