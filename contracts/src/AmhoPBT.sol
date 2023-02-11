// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import 'forge-std/console.sol';
import './IPBT.sol';
import './ERC721ReadOnly.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

error InvalidSignature();
error NoMintedTokenForChip();
error NoMappedTokenForChip();
error ArrayLengthMismatch();
error SeedingChipDataForExistingToken();
error UpdatingChipForUnsetChipMapping();
error InvalidBlockNumber();
error BlockNumberTooOld();

/**
 * Implementation of PBT where all chipAddress->tokenIds are preset in the contract by the contract owner.
 */
contract AmhoPBT is ERC721ReadOnly, IPBT {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;

  uint256 public immutable maxSupply;
  uint256 private _numAvailableRemainingTokens;

  Counters.Counter private currentTokenId;
  // use counters to keep track of the number of tokens that have been minted

  /**
   * Mapping from chipAddress to TokenData
   */

  mapping(address => bool) _chipWhitelist;
  mapping(uint256 => address) _chipToAddress;

  constructor(
    string memory name_,
    string memory symbol_,
    uint256 maxSupply_
  ) ERC721ReadOnly(name_, symbol_) {
    maxSupply = maxSupply_;
    _numAvailableRemainingTokens = maxSupply_;
  }

  // Should only be called for tokenIds that have not yet been minted
  // If the tokenId has already been minted, use _updateChips instead
  // TODO: consider preventing multiple chip addresses mapping to the same tokenId (store a tokenId->chip mapping)
  // function _seedChipToTokenMapping(address[] memory chipAddresses, uint256[] memory tokenIds) internal {
  //   _seedChipToTokenMapping(chipAddresses, tokenIds, true);
  // }
  function _getChipAddress(uint256 index) public view returns (address) {
    return _chipToAddress[index];
  }

  function _addChipToWhitelist(bytes memory signature, uint256 blockNumberUsedInSig) internal {
    address chipAddress = recoverChipAddress(signature, blockNumberUsedInSig);
    console.log('Chip added to whitelist: ', chipAddress);
    _chipToAddress[currentTokenId.current()] = chipAddress;
    _chipWhitelist[chipAddress] = true;
  }

  // function _seedChipToTokenMapping(
  //     address[] memory chipAddresses,
  //     uint256[] memory tokenIds,
  //     bool throwIfTokenAlreadyMinted
  // ) internal {
  //     uint256 tokenIdsLength = tokenIds.length;
  //     if (tokenIdsLength != chipAddresses.length) {
  //         revert ArrayLengthMismatch();
  //     }
  //     for (uint256 i = 0; i < tokenIdsLength; ++i) {
  //         address chipAddress = chipAddresses[i];
  //         uint256 tokenId = tokenIds[i];
  //         if (throwIfTokenAlreadyMinted && _exists(tokenId)) {
  //             revert SeedingChipDataForExistingToken();
  //         }
  //         _tokenDatas[chipAddress] = TokenData(chipAddress);
  //     }
  // }

  // Should only be called for tokenIds that have been minted
  // If the tokenId hasn't been minted yet, use _seedChipToTokenMapping instead
  // Should only be used and called with care and rails to avoid a centralized entity swapping out valid chips.
  // TODO: consider preventing multiple chip addresses mapping to the same tokenId (store a tokenId->chip mapping)
  // function _updateChips(address[] calldata chipAddressesOld, address[] calldata chipAddressesNew) internal {
  //     if (chipAddressesOld.length != chipAddressesNew.length) {
  //         revert ArrayLengthMismatch();
  //     }
  //     for (uint256 i = 0; i < chipAddressesOld.length; ++i) {
  //         address oldChipAddress = chipAddressesOld[i];
  //         TokenData memory oldTokenData = _tokenDatas[oldChipAddress];
  //         if (!oldTokenData.set) {
  //             revert UpdatingChipForUnsetChipMapping();
  //         }
  //         address newChipAddress = chipAddressesNew[i];
  //         uint256 tokenId = oldTokenData.tokenId;
  //         _tokenDatas[newChipAddress] = TokenData(tokenId, newChipAddress, true);
  //         if (_exists(tokenId)) {
  //             emit PBTChipRemapping(tokenId, oldChipAddress, newChipAddress);
  //         }
  //         delete _tokenDatas[oldChipAddress];
  //     }
  // }

  // function tokenIdFor(address chipAddress) external view override returns (uint256) {
  //     uint256 tokenId = tokenIdMappedFor(chipAddress);
  //     if (!_exists(tokenId)) {
  //         revert NoMintedTokenForChip();
  //     }
  //     return tokenId;
  // }

  // function tokenIdMappedFor(address chipAddress) public view returns (uint256) {
  //     if (!_tokenDatas[chipAddress].set) {
  //         revert NoMappedTokenForChip();
  //     }
  //     return _tokenDatas[chipAddress].tokenId;
  // }

  // Returns true if the signer of the signature of the payload is the chip for the token id
  function recoverChipAddress(bytes memory signature, uint256 blockNumberUsedInSig) public view returns (address) {
    bytes32 blockHash = blockhash(blockNumberUsedInSig);
    bytes32 payloadHash = keccak256(abi.encodePacked(_msgSender(), blockHash));
    bytes32 signedHash = payloadHash.toEthSignedMessageHash();
    address recoveredAddr = signedHash.recover(signature);
    return recoveredAddr;
  }

  // function isChipSignatureValid(
  // bytes memory payload,
  //   bytes memory signature
  // ) public view override returns (bool) {
  //   if (!_exists(tokenId)) {
  //     revert NoMintedTokenForChip();
  //   }
  //   address chipAddr = recoverChipAddress(payload, signature);
  //   // return _tokenDatas[chipAddr].set && _tokenDatas[chipAddr].tokenId == tokenId;
  //   return _chipWhitelist[chipAddr];
  // }

  //
  // Parameters:
  //    to: the address of the new owner
  //    signatureFromChip: signature(receivingAddress + recentBlockhash), signed by an approved chip
  //
  // Contract should check that (1) recentBlockhash is a recent blockhash, (2) receivingAddress === to, and (3) the signing chip is allowlisted.
  function _mintTokenWithChip(bytes calldata signatureFromChip, uint256 blockNumberUsedInSig)
    internal
    isChipWhitelisted(signatureFromChip, blockNumberUsedInSig)
    returns (uint256)
  {
    uint256 tokenId = currentTokenId.current();
    address recipient = _msgSender();
    currentTokenId.increment();
    _numAvailableRemainingTokens--;
    _mint(recipient, tokenId);
    emit PBTMint(recipient, tokenId);
    return tokenId;
  }
  // function transferTokenWithChip(bytes calldata signatureFromChip, uint256 blockNumberUsedInSig) public override {
  //   transferTokenWithChip(signatureFromChip, blockNumberUsedInSig, false);
  // }

  // function transferTokenWithChip(
  //   bytes calldata signatureFromChip,
  //   uint256 blockNumberUsedInSig,
  //   bool useSafeTransferFrom
  // ) public override {
  //   _transferTokenWithChip(signatureFromChip, blockNumberUsedInSig, useSafeTransferFrom);
  // }

  // function _transferTokenWithChip(
  //   bytes calldata signatureFromChip,
  //   uint256 blockNumberUsedInSig,
  //   bool useSafeTransferFrom
  // ) internal virtual {
  //   uint256 tokenId = _getTokenDataForChipSignature(signatureFromChip, blockNumberUsedInSig).tokenId;
  //   if (useSafeTransferFrom) {
  //     _safeTransfer(ownerOf(tokenId), _msgSender(), tokenId, '');
  //   } else {
  //     _transfer(ownerOf(tokenId), _msgSender(), tokenId);
  //   }
  // }

  // function _getTokenDataForChipSignature(bytes calldata signatureFromChip, uint256 blockNumberUsedInSig) internal view returns (TokenData memory) {
  //   // The blockNumberUsedInSig must be in a previous block because the blockhash of the current
  //   // block does not exist yet.
  //   if (block.number <= blockNumberUsedInSig) {
  //     revert InvalidBlockNumber();
  //   }

  //   unchecked {
  //     if (block.number - blockNumberUsedInSig > getMaxBlockhashValidWindow()) {
  //       revert BlockNumberTooOld();
  //     }
  //   }

  //   bytes32 blockHash = blockhash(blockNumberUsedInSig);
  //   bytes32 signedHash = keccak256(abi.encodePacked(_msgSender(), blockHash)).toEthSignedMessageHash();
  //   address chipAddr = signedHash.recover(signatureFromChip);

  //   TokenData memory tokenData = tokenDatas[chipAddr];
  //   if (tokenData.set) {
  //     return tokenData;
  //   }
  //   revert InvalidSignature();
  // }

  function getMaxBlockhashValidWindow() public pure virtual returns (uint256) {
    return 100;
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IPBT).interfaceId || super.supportsInterface(interfaceId);
  }

  modifier isChipWhitelisted(bytes calldata signatureFromChip, uint256 blockNumberUsedInSig) {
    address chipAddress = recoverChipAddress(signatureFromChip, blockNumberUsedInSig);
    require(_chipWhitelist[chipAddress], 'Chip is not whitelisted');
    _;
  }
}
