import * as dotenv from "dotenv";
import { task } from "hardhat/config";

dotenv.config();

task("mint", "Mint NumberCollectible nft")
  .addParam("to", "Address of recipient")
  .setAction(async (args, hre) => {
    const contractAddress = process.env.CONTRACT_ADDRESS as string;
    const nftInstance = await hre.ethers.getContractAt("NumberCollectible", contractAddress)

    const result = await nftInstance.safeMint(args.to);
    console.log(result);
  });

  export default {
    solidity: "0.8.4"
  };