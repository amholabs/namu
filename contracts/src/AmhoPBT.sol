// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import 'forge-std/console.sol';
import './IPBT.sol';
import './ERC721ReadOnly.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

error InvalidSignature();
error InvalidChipAddress();
error InvalidNonce();
error NoMintedTokenForChip();
error ArrayLengthMismatch();
error ChipAlreadyLinkedToMintedToken();
error ChipHasReachedMaxSupply();
error ChipHasReachedMaxSlots();
error UpdatingChipForUnsetChipMapping();
error NoMoreTokenIds();
error InvalidBlockNumber();
error BlockNumberTooOld();

library Counter {
  struct CounterData {
    uint256 _value;
  }

  function current(CounterData storage counter) internal view returns (uint256) {
    return counter._value;
  }

  function increment(CounterData storage counter) internal {
    unchecked {
      counter._value += 1;
    }
  }
}

/**
 * Implementation of PBT where all tokenIds are randomly chosen at mint time.
 */
contract AmhoPBT is ERC721ReadOnly, IPBT {
  using ECDSA for bytes32;
  using Counter for Counter.CounterData;

  Counter.CounterData internal _tokenId;

  string public constant tokenURI = 'ipfs://bafkreidvps5wz437mgxngllbyygkokzmjqdish6bexcytzyodbfgg2yqqy';

  struct TokenData {
    uint256 tokenId;
    uint256 floatSupply;
    address chipAddress;
    bool set;
  }

  // Mapping from chipAddress to TokenData
  mapping(address => TokenData) _tokenDatas;

  // Max token supply
  uint256 private _numAvailableRemainingTokens;
  uint256 private _numAvailableRemainingSlots;

  mapping(address => uint256) public _nonceToAddress;

  // Data structure used for Fisher Yates shuffle
  mapping(uint256 => uint256) internal _availableRemainingTokens;

  constructor(
    string memory name_,
    string memory symbol_,
    uint256 maxSupply_,
    address trustedForwarder_
  ) ERC721ReadOnly(name_, symbol_, trustedForwarder_) {
    _numAvailableRemainingTokens = maxSupply_;
    _numAvailableRemainingSlots = maxSupply_;
  }

  function _seedChipAddresses(address[] memory chipAddresses, uint256 floatSupply) internal {
    for (uint256 i = 0; i < chipAddresses.length; ++i) {
      address chipAddress = chipAddresses[i];
      if (floatSupply > _numAvailableRemainingSlots) {
        revert ChipHasReachedMaxSlots();
      }
      _numAvailableRemainingSlots--;
      _tokenDatas[chipAddress] = TokenData(0, floatSupply, chipAddress, false);
    }
  }

  // TODO: consider preventing multiple chip addresses mapping to the same tokenId (store a tokenId->chip mapping)
  function _updateChips(address[] calldata chipAddressesOld, address[] calldata chipAddressesNew) internal {
    if (chipAddressesOld.length != chipAddressesNew.length) {
      revert ArrayLengthMismatch();
    }

    for (uint256 i = 0; i < chipAddressesOld.length; i++) {
      address oldChipAddress = chipAddressesOld[i];
      uint256 oldFloatSupply = _tokenDatas[oldChipAddress].floatSupply;
      if (!_tokenDatas[oldChipAddress].set) {
        revert UpdatingChipForUnsetChipMapping();
      }
      address newChipAddress = chipAddressesNew[i];
      uint256 tokenId = _tokenDatas[oldChipAddress].tokenId;
      _tokenDatas[newChipAddress] = TokenData(tokenId, oldFloatSupply, newChipAddress, true);
      emit PBTChipRemapping(tokenId, oldChipAddress, newChipAddress);
      delete _tokenDatas[oldChipAddress];
    }
  }

  function getNonce() public view returns (uint256) {
    return _nonceToAddress[_msgSender()];
  }

  function useNonce() public returns (uint256) {
    uint256 currentNonce = _nonceToAddress[_msgSender()];
    _nonceToAddress[_msgSender()]++;
    return currentNonce;
  }

  function tokenIdFor(address chipAddress) external view returns (uint256) {
    if (!_tokenDatas[chipAddress].set) {
      revert NoMintedTokenForChip();
    }
    return _tokenDatas[chipAddress].tokenId;
  }

  // Returns true if the signer of the signature of the payload is the chip for the token id
  function isChipSignatureForToken(
    uint256 tokenId,
    bytes memory payload,
    bytes memory signature
  ) public view returns (bool) {
    if (!_exists(tokenId)) {
      revert NoMintedTokenForChip();
    }
    bytes32 signedHash = keccak256(payload).toEthSignedMessageHash();
    address chipAddr = signedHash.recover(signature);
    return _tokenDatas[chipAddr].set && _tokenDatas[chipAddr].tokenId == tokenId;
  }

  // Parameters:
  //    to: the address of the new owner
  //    signatureFromChip: signature(receivingAddress + recentBlockhash), signed by an approved chip
  //
  // Contract should check that (1) recentBlockhash is a recent blockhash, (2) receivingAddress === to, and (3) the signing chip is allowlisted.

  function _mint(address to, uint256 tokenId) internal virtual override {
    super._mint(to, tokenId);
  }

  function _mintTokenWithChip(
    bytes memory signatureFromChip,
    uint256 blockNumberUsedInSig,
    uint256 nonce
  ) internal returns (uint256) {
    address chipAddr = _getChipAddrForChipSignature(signatureFromChip, blockNumberUsedInSig, nonce);

    uint256 totalSupply = _tokenId.current() + 1;

    if (_tokenDatas[chipAddr].chipAddress != chipAddr) {
      revert InvalidChipAddress();
    }

    if (_tokenDatas[chipAddr].floatSupply == 0) {
      revert ChipHasReachedMaxSlots();
    }

    if (_numAvailableRemainingTokens == 0) {
      revert ChipHasReachedMaxSupply();
    }

    uint256 tokenId = _tokenId.current();
    uint256 oldFloatSupply = _tokenDatas[chipAddr].floatSupply;
    uint256 newFloatSupply = oldFloatSupply - 1;

    _tokenId.increment();
    _tokenDatas[chipAddr] = TokenData(tokenId, newFloatSupply, chipAddr, true);
    _numAvailableRemainingTokens--;

    _mint(_msgSender(), tokenId);
    _setTokenURI(tokenId, tokenURI);

    emit PBTMint(chipAddr, tokenId);

    return tokenId;
  }

  // function _useRandomAvailableTokenId() internal returns (uint256) {
  //   uint256 numAvailableRemainingTokens = _numAvailableRemainingTokens;
  //   if (numAvailableRemainingTokens == 0) {
  //     revert NoMoreTokenIds();
  //   }

  //   uint256 randomNum = _getRandomNum(numAvailableRemainingTokens);
  //   uint256 randomIndex = randomNum % numAvailableRemainingTokens;
  //   uint256 valAtIndex = _availableRemainingTokens[randomIndex];

  //   uint256 result;
  //   if (valAtIndex == 0) {
  //     // This means the index itself is still an available token
  //     result = randomIndex;
  //   } else {
  //     // This means the index itself is not an available token, but the val at that index is.
  //     result = valAtIndex;
  //   }

  //   uint256 lastIndex = numAvailableRemainingTokens - 1;
  //   if (randomIndex != lastIndex) {
  //     // Replace the value at randomIndex, now that it's been used.
  //     // Replace it with the data from the last index in the array, since we are going to decrease the array size afterwards.
  //     uint256 lastValInArray = _availableRemainingTokens[lastIndex];
  //     if (lastValInArray == 0) {
  //       // This means the index itself is still an available token
  //       _availableRemainingTokens[randomIndex] = lastIndex;
  //     } else {
  //       // This means the index itself is not an available token, but the val at that index is.
  //       _availableRemainingTokens[randomIndex] = lastValInArray;
  //       delete _availableRemainingTokens[lastIndex];
  //     }
  //   }

  //   _numAvailableRemainingTokens--;

  //   return result;
  // }

  // Devs can swap this out for something less gameable like chainlink if it makes sense for their use case.
  // function _getRandomNum(uint256 numAvailableRemainingTokens) internal view virtual returns (uint256) {
  //   return
  //     uint256(
  //       keccak256(
  //         abi.encode(
  //           _msgSender(),
  //           tx.gasprice,
  //           block.number,
  //           block.timestamp,
  //           block.difficulty,
  //           blockhash(block.number - 1),
  //           address(this),
  //           numAvailableRemainingTokens
  //         )
  //       )
  //     );
  // }

  function transferTokenWithChip(
    bytes calldata signatureFromChip,
    uint256 blockNumberUsedInSig,
    uint256 nonce
  ) public {
    _transferTokenWithChip(signatureFromChip, blockNumberUsedInSig, false, nonce);
  }

  function transferTokenWithChip(
    bytes calldata signatureFromChip,
    uint256 blockNumberUsedInSig,
    bool useSafeTransferFrom,
    uint256 nonce
  ) public {
    _transferTokenWithChip(signatureFromChip, blockNumberUsedInSig, useSafeTransferFrom, nonce);
  }

  function _transferTokenWithChip(
    bytes calldata signatureFromChip,
    uint256 blockNumberUsedInSig,
    bool useSafeTransferFrom,
    uint256 nonce
  ) internal virtual {
    TokenData memory tokenData = _getTokenDataForChipSignature(signatureFromChip, blockNumberUsedInSig, nonce);
    uint256 tokenId = tokenData.tokenId;
    if (useSafeTransferFrom) {
      _safeTransfer(ownerOf(tokenId), _msgSender(), tokenId, '');
    } else {
      _transfer(ownerOf(tokenId), _msgSender(), tokenId);
    }
  }

  function _getTokenDataForChipSignature(
    bytes calldata signatureFromChip,
    uint256 blockNumberUsedInSig,
    uint256 nonce
  ) internal returns (TokenData memory) {
    address chipAddr = _getChipAddrForChipSignature(signatureFromChip, blockNumberUsedInSig, nonce);
    TokenData memory tokenData = _tokenDatas[chipAddr];
    if (tokenData.set) {
      return tokenData;
    }
    revert InvalidSignature();
  }

  function _getChipAddrForChipSignature(
    bytes memory signatureFromChip,
    uint256 blockNumberUsedInSig,
    uint256 _nonce
  ) internal returns (address) {
    // The blockNumberUsedInSig must be in a previous block because the blockhash of the current
    // block does not exist yet.
    if (_nonce != getNonce()) {
      revert InvalidNonce();
    }

    if (block.number <= blockNumberUsedInSig) {
      revert InvalidBlockNumber();
    }

    if (block.number - blockNumberUsedInSig > getMaxBlockhashValidWindow()) {
      revert BlockNumberTooOld();
    }

    uint256 nonce_ = useNonce();
    uint256 nonce_1 = getNonce();
    bytes32 blockHash = blockhash(blockNumberUsedInSig);
    bytes32 signedHash = keccak256(abi.encodePacked(_msgSender(), blockHash, nonce_)).toEthSignedMessageHash();
    return signedHash.recover(signatureFromChip);
  }

  function getMaxBlockhashValidWindow() public pure virtual returns (uint256) {
    return 100;
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IPBT).interfaceId || super.supportsInterface(interfaceId);
  }
}
