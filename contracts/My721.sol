// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NumberCollectible is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenId;

    uint256 public maxSupply = 10;
    uint256 private mintFee = 0.0005 ether;
    string private tokenCID = "QmSeAyQ55prvUASLJpj4KN36NJRvDkSu18oKcMsM2scCSy";

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function _baseURI(string memory _tokenCID) internal pure returns (string memory) {
        return string(abi.encodePacked("https://gateway.pinata.cloud/ipfs/", _tokenCID));
    }

    function safeMint(address to) external payable {
        require(totalSupply() <= maxSupply, "Mint limit exeeded!");
        require(msg.value >= mintFee || msg.sender == owner(), "Not enough fee!");

        uint256 tokenId = _tokenId.current();
        _tokenId.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _baseURI(tokenCID));
    }

    function totalSupply() public view returns(uint256) {
        return _tokenId.current();
    }

    function withdraw(address recipient) external onlyOwner returns(bool) {
        payable(recipient).transfer(address(this).balance);
        return true;
    }
}
