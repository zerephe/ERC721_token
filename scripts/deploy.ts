import { Address } from "cluster";
import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners()
  const My721 = await ethers.getContractFactory("NumberCollectible", owner);
  const numCollectible = await My721.deploy("NumberCollectible", "NCOL");
 
  await numCollectible.deployed();

  console.log("Deployed to:", numCollectible.address);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

export default {
  solidity: "0.8.4"
};