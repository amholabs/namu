// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import '../AmhoPBT.sol';

contract AmhoPBTMock is AmhoPBT {
  constructor(
    string memory name_,
    string memory symbol_,
    uint256 supply_,
    address trustedForwarder_
  ) AmhoPBT(name_, symbol_, supply_, trustedForwarder_) {}

  function mint(address to, uint256 tokenId) public {
    revert('Can only mint from scanning');
  }

  function getTokenData(address addr) public view returns (TokenData memory) {
    return _tokenDatas[addr];
  }

  function updateChips(address[] calldata chipAddressesOld, address[] calldata chipAddressesNew) public {
    _updateChips(chipAddressesOld, chipAddressesNew);
  }

  function seedChipAddresses(address[] calldata chipAddresses, uint256 floatSupply) public {
    _seedChipAddresses(chipAddresses, floatSupply);
  }

  function mintTokenWithChip(
    bytes calldata signatureFromChip,
    uint256 blockNumberUsedInSig,
    uint256 nonce
  ) public returns (uint256) {
    return _mintTokenWithChip(signatureFromChip, blockNumberUsedInSig, nonce);
  }

  function getTokenDataForChipSignature(
    bytes calldata signatureFromChip,
    uint256 blockNumberUsedInSig,
    uint256 nonce
  ) public returns (TokenData memory) {
    return _getTokenDataForChipSignature(signatureFromChip, blockNumberUsedInSig, nonce);
  }

  function getAvailableRemainingTokens(uint256 index) public view returns (uint256) {
    return _availableRemainingTokens[index];
  }
}
