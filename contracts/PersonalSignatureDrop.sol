// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import '@thirdweb-dev/contracts/base/ERC721SignatureMint.sol';
import '@thirdweb-dev/contracts/openzeppelin-presets/utils/cryptography/ECDSA.sol';

contract PersonalSignatureDrop is ERC721SignatureMint {
  mapping(bytes32 => bool) private minted;

  constructor(
    string memory _name,
    string memory _symbol,
    address _royaltyRecipient,
    uint128 _royaltyBps
  ) ERC721SignatureMint(_name, _symbol, _royaltyRecipient, _royaltyBps, msg.sender) {}

  function verify(MintRequest calldata _req, bytes calldata _signature) public view override returns (bool success, address signer) {
    signer = _recoverAddress(_req, _signature);
    success = !minted[_req.uid] && _canSignMintRequest(signer);
  }

  function _recoverAddress(MintRequest calldata _req, bytes calldata _signature) internal view override returns (address) {
    bytes32 _hashedPersonalSign = _hashPersonalSign(abi.encode(_req));
    return ECDSA.recover(_hashedPersonalSign, _signature);
  }

  function _hashPersonalSign(bytes memory s) internal pure returns (bytes32) {
    return ECDSA.toEthSignedMessageHash(keccak256(s));
  }
}
