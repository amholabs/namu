// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import '../AmhoPBT.sol';

contract AmhoPBTMock is AmhoPBT {
  constructor(
    string memory name_,
    string memory symbol_,
    uint256 totalSupply
  ) AmhoPBT(name_, symbol_, totalSupply) {}

  function mint(address to, uint256 tokenId) public {
    _mint(to, tokenId);
  }

  // function seedChipToTokenMapping(
  //   address[] memory chipAddresses,
  //   uint256[] memory tokenIds,
  //   bool throwIfTokenAlreadyMinted
  // ) public {
  //   _seedChipToTokenMapping(chipAddresses, tokenIds, throwIfTokenAlreadyMinted);
  // }
  function addChipToWhitelist(bytes calldata signatureFromChip, uint256 blockNumberUsedInSig) public {
    _addChipToWhitelist(signatureFromChip, blockNumberUsedInSig);
  }

  // function getTokenData(address addr) public view returns (TokenData memory) {
  //   return _tokenDatas[addr];
  // }

  // function updateChips(address[] calldata chipAddressesOld, address[] calldata chipAddressesNew) public {
  //   _updateChips(chipAddressesOld, chipAddressesNew);
  // }

  function mintTokenWithChip(bytes calldata signatureFromChip, uint256 blockNumberUsedInSig, string memory nonce) public returns (uint256) {
    return _mintTokenWithChip(signatureFromChip, blockNumberUsedInSig, nonce);
  }

  // function getTokenDataForChipSignature(bytes calldata signatureFromChip, uint256 blockNumberUsedInSig) public returns (TokenData memory) {
  //   return _getTokenDataForChipSignature(signatureFromChip, blockNumberUsedInSig);
  // }
}
