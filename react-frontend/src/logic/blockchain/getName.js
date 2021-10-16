import namehash from "eth-ens-namehash";

export default async function getName(address) {
  const lookup = address.toLowerCase().substr(2) + ".addr.reverse";
  const ResolverContract = await window.web3.eth.ens.resolver(lookup);
  const nh = namehash.hash(lookup);

  return ResolverContract.methods.name(nh).call();
}
