// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * An implementation of 721 that's publicly readonly (no approvals or transfers exposed).
 */

contract ERC721ReadOnly is ERC721URIStorage {
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function approve(address to, uint256 tokenId) public virtual override {
        revert("ERC721 public approve not allowed");
    }

    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), "ERC721: invalid token ID");
        return address(0);
    }

    function setApprovalForAll(address operator, bool approved) public virtual override {
        revert("ERC721 public setApprovalForAll not allowed");
    }

    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return false;
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("ERC721 public transferFrom not allowed");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("ERC721 public safeTransferFrom not allowed");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        revert("ERC721 public safeTransferFrom not allowed");
    }
    // override setTokenURI and call super to avoid the check for the token existing
    function setTokenURI(uint256 tokenId, string memory _tokenURI) public virtual {
        _setTokenURI(tokenId, _tokenURI);
    }
}
