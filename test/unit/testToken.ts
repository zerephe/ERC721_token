import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

describe("NumberCollectible NFTs", function () {

  let nftInstance: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function(){
    const Token = await ethers.getContractFactory("NumberCollectible");
    nftInstance = await Token.deploy("NumCol", "NCOL");
    [owner, addr1] = await ethers.getSigners();

    await nftInstance.deployed();
  });

  describe("Deploy", function(){
    it("Should return proper token addresses on deploy", async function() {
      expect(nftInstance.address).to.be.properAddress;
    });

    it("Should have proper initial values", async function() {
      expect(await nftInstance.maxSupply()).to.eq(10);
      expect(await nftInstance.totalSupply()).to.eq(0);
      expect(await nftInstance.name()).to.eq("NumCol");
      expect(await nftInstance.symbol()).to.eq("NCOL");
    });
  });

  describe("Txs", function() {
    it("Should have some nft after minting and total supply change", async function() {
      await nftInstance.safeMint(owner.address);
      expect(await nftInstance.balanceOf(owner.address)).to.eq(1);
      expect(await nftInstance.totalSupply()).to.eq(1);
    });

    it("Should be reverted if mint limit exceeded", async function() {
      for(let i = 0; i < 11; i++) {
        await nftInstance.safeMint(owner.address);
      }
      await expect(nftInstance.safeMint(owner.address)).to.be.revertedWith("Mint limit exeeded!");
    });

    it("Should be reverted if not enough fee sent", async function() {
      await expect(nftInstance.connect(addr1).safeMint(addr1.address)).to.be.revertedWith("Not enough fee!");
    });

    it("Should be possible to withdraw", async function() {
      await nftInstance.connect(addr1).safeMint(addr1.address, {value: ethers.utils.parseEther("0.0005").toString()});

      let _withdraw = await nftInstance.withdraw(owner.address);
      await expect(() => _withdraw).to.changeEtherBalances([nftInstance, owner], [-ethers.utils.parseEther("0.0005").toString(), ethers.utils.parseEther("0.0005").toString()]);
      await _withdraw.wait();
    });
  });
});