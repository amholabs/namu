// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import 'forge-std/console.sol';
import 'forge-std/Test.sol';
import '../src/IPBT.sol';
import '../src/mocks/AmhoPBTMock.sol';

contract AmhoPBTRandomTest is Test {
  event PBTMint(uint256 indexed tokenId, address indexed chipAddress);
  event PBTChipRemapping(uint256 indexed tokenId, address indexed oldChipAddress, address indexed newChipAddress);
  event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

  AmhoPBTMock public pbt;
  uint256 public tokenId1 = 1;
  uint256 public tokenId2 = 2;
  uint256 public tokenId3 = 3;
  address public user1 = vm.addr(1);
  address public user2 = vm.addr(2);
  address public user3 = vm.addr(3);
  address public trustedForward = vm.addr(4);
  address public chipAddr1 = vm.addr(101);
  address public chipAddr2 = vm.addr(102);
  address public chipAddr3 = vm.addr(103);
  address public chipAddr4 = vm.addr(104);
  uint256 public blockNumber = 10;
  uint256 public floatSupply = 1;
  uint256 public maxSupply = 5;
  uint256 public nonce = 0;

  function setUp() public {
    pbt = new AmhoPBTMock('AmhoIRL', 'AMHO', maxSupply, trustedForward);
  }

  function _createSignature(bytes memory payload, uint256 chipAddrNum) private returns (bytes memory signature) {
    bytes32 payloadHash = keccak256(abi.encodePacked(payload));
    bytes32 signedHash = keccak256(abi.encodePacked('\x19Ethereum Signed Message:\n32', payloadHash));
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(chipAddrNum, signedHash);
    signature = abi.encodePacked(r, s, v);
  }

  function _createSignature(bytes32 payload, uint256 chipAddrNum) private returns (bytes memory signature) {
    return _createSignature(abi.encodePacked(payload), chipAddrNum);
  }

  function testMintTokenWithChip() public {
    // Change block number to the next block to set blockHash(blockNumber)
    vm.roll(blockNumber + 1);

    vm.startPrank(user1);
    uint256 _nonce = pbt.getNonce();
    bytes memory payload = abi.encodePacked(user1, blockhash(blockNumber), _nonce);
    bytes memory signature = _createSignature(payload, 101);

    vm.roll(blockNumber + 2);
    uint256 expectedTokenId = 3;

    // First mint will fail because seeding hasn't happened
    vm.expectRevert(InvalidChipAddress.selector);
    pbt.mintTokenWithChip(signature, blockNumber, _nonce);

    // Seed chip addresses
    address[] memory chipAddresses = new address[](1);
    chipAddresses[0] = chipAddr1;
    pbt.seedChipAddresses(chipAddresses, floatSupply);

    // Mint should now succeed
    // vm.expectEmit(true, true, true, true);
    emit PBTMint(expectedTokenId, chipAddr1);
    _nonce = pbt.getNonce();
    payload = abi.encodePacked(user1, blockhash(blockNumber), _nonce);
    signature = _createSignature(payload, 101);
    pbt.mintTokenWithChip(signature, blockNumber, _nonce);

    // Prevent use of same nonce again
    vm.expectRevert(InvalidNonce.selector);
    pbt.mintTokenWithChip(signature, blockNumber, _nonce);

    _nonce = pbt.getNonce();
    payload = abi.encodePacked(user1, blockhash(blockNumber), _nonce);
    signature = _createSignature(payload, 101);

    // Prevent mint if no more slots on chip

    vm.expectRevert(ChipHasReachedMaxSlots.selector);
    pbt.mintTokenWithChip(signature, blockNumber, _nonce);

    pbt.seedChipAddresses(chipAddresses, maxSupply - 1);

    _nonce = pbt.getNonce();
    payload = abi.encodePacked(user1, blockhash(blockNumber), _nonce);
    signature = _createSignature(payload, 101);
    pbt.mintTokenWithChip(signature, blockNumber, _nonce);

    _nonce = pbt.getNonce();
    payload = abi.encodePacked(user1, blockhash(blockNumber), _nonce);
    signature = _createSignature(payload, 101);
    pbt.mintTokenWithChip(signature, blockNumber, _nonce);

    _nonce = pbt.getNonce();
    payload = abi.encodePacked(user1, blockhash(blockNumber), _nonce);
    signature = _createSignature(payload, 101);
    pbt.mintTokenWithChip(signature, blockNumber, _nonce);

    _nonce = pbt.getNonce();
    payload = abi.encodePacked(user1, blockhash(blockNumber), _nonce);
    signature = _createSignature(payload, 101);
    pbt.mintTokenWithChip(signature, blockNumber, _nonce);

    _nonce = pbt.getNonce();
    payload = abi.encodePacked(user1, blockhash(blockNumber), _nonce);
    signature = _createSignature(payload, 101);
    vm.expectRevert(ChipHasReachedMaxSlots.selector);
    pbt.mintTokenWithChip(signature, blockNumber, _nonce);
  }

  function testMintAndOverSeed() public {
    vm.roll(blockNumber + 1);

    vm.startPrank(user1);
    uint256 nonce1 = pbt.getNonce();
    bytes memory payload = abi.encodePacked(user1, blockhash(blockNumber), nonce1);
    bytes memory signature = _createSignature(payload, 101);

    address[] memory chipAddresses = new address[](1);
    chipAddresses[0] = chipAddr1;
    pbt.seedChipAddresses(chipAddresses, maxSupply);

    uint256 tokenId = pbt.mintTokenWithChip(signature, blockNumber, nonce1);

    vm.expectRevert(ChipHasReachedMaxSlots.selector);
    pbt.seedChipAddresses(chipAddresses, maxSupply);
  }

  function testBurning() public {
    // Change block number to the next block to set blockHash(blockNumber)
    vm.roll(blockNumber + 1);

    vm.startPrank(user1);
    uint256 nonce1 = pbt.getNonce();
    bytes memory payload = abi.encodePacked(user1, blockhash(blockNumber), nonce1);
    bytes memory signature = _createSignature(payload, 101);

    // Seed chip addresses
    address[] memory chipAddresses = new address[](1);
    chipAddresses[0] = chipAddr1;
    vm.expectRevert(ChipHasReachedMaxSlots.selector);
    pbt.seedChipAddresses(chipAddresses, maxSupply + 1);

    // Mint should now succeed
    pbt.seedChipAddresses(chipAddresses, 2);
    uint256 tokenId = pbt.mintTokenWithChip(signature, blockNumber, nonce1);
    vm.stopPrank();

    vm.roll(blockNumber + 2);

    vm.startPrank(user1);
    uint256 nonce2 = pbt.getNonce();
    bytes memory payload1 = abi.encodePacked(user1, blockhash(blockNumber), nonce2);
    bytes memory signature1 = _createSignature(payload1, 101);

    uint256 tokenId2 = pbt.mintTokenWithChip(signature1, blockNumber, nonce2);
    vm.expectEmit(true, true, true, true);
    emit Transfer(user1, address(0), tokenId);
    pbt.burn(tokenId);
    vm.stopPrank();
  }

  function testSeedingMaxPerChip() public {
    // Change block number to the next block to set blockHash(blockNumber)
    vm.roll(blockNumber + 1);

    bytes memory payload = abi.encodePacked(user1, blockhash(blockNumber));
    bytes memory signature = _createSignature(payload, 101);

    vm.startPrank(user1);
    vm.roll(blockNumber + 2);
    uint256 expectedTokenId = 3;

    // Seed chip addresses
    address[] memory chipAddresses = new address[](1);
    chipAddresses[0] = chipAddr1;
    vm.expectRevert(ChipHasReachedMaxSlots.selector);
    pbt.seedChipAddresses(chipAddresses, maxSupply + 1);
  }

  function testTokenDataUpdate() public {
    vm.roll(blockNumber + 1);

    vm.startPrank(user1);
    uint256 nonce1 = pbt.getNonce();
    bytes memory payload = abi.encodePacked(user1, blockhash(blockNumber), nonce1);
    bytes memory signature = _createSignature(payload, 101);
    vm.roll(blockNumber + 2);
    uint256 expectedTokenId = 3;

    // Seed chip addresses
    address[] memory chipAddresses = new address[](1);
    chipAddresses[0] = chipAddr1;
    pbt.seedChipAddresses(chipAddresses, floatSupply);

    uint256 nonce2 = pbt.getNonce();
    emit PBTMint(expectedTokenId, chipAddr1);
    pbt.mintTokenWithChip(signature, blockNumber, nonce2);

    AmhoPBT.TokenData memory tokenData = pbt.getTokenData(chipAddresses[0]);
    assertEq(tokenData.floatSupply, 0);
  }

  modifier withSeededChips() {
    address[] memory chipAddresses = new address[](3);
    chipAddresses[0] = chipAddr1;
    chipAddresses[1] = chipAddr2;
    chipAddresses[2] = chipAddr3;
    pbt.seedChipAddresses(chipAddresses, floatSupply);
    _;
  }

  function testIsChipSignatureForToken() public withSeededChips {
    vm.roll(blockNumber + 1);

    vm.startPrank(user1);
    uint256 nonce1 = pbt.getNonce();
    bytes memory payload = abi.encodePacked(user1, blockhash(blockNumber), nonce1);
    bytes memory signature = _createSignature(payload, 101);
    vm.roll(blockNumber + 2);
    uint256 tokenId = pbt.mintTokenWithChip(signature, blockNumber, nonce);
    assertEq(pbt.isChipSignatureForToken(tokenId, payload, signature), true);

    vm.expectRevert(NoMintedTokenForChip.selector);
    pbt.isChipSignatureForToken(tokenId + 1, payload, signature);
  }

  function testUpdateChips() public {
    // Change block number to the next block to set blockHash(blockNumber)
    vm.roll(blockNumber + 1);

    address[] memory oldChips = new address[](2);
    oldChips[0] = chipAddr1;
    oldChips[1] = chipAddr2;
    pbt.seedChipAddresses(oldChips, floatSupply);

    address[] memory newChips = new address[](2);
    newChips[0] = chipAddr3;
    newChips[1] = chipAddr4;

    // Chips haven't minted so they can't be updated
    vm.expectRevert(UpdatingChipForUnsetChipMapping.selector);
    pbt.updateChips(oldChips, newChips);

    // Mint the two chip addresses
    vm.prank(user1);
    uint256 nonce1 = pbt.getNonce();
    bytes memory payload = abi.encodePacked(user1, blockhash(blockNumber), nonce1);
    bytes memory signature = _createSignature(payload, 101);

    vm.prank(user1);
    uint256 tokenId1 = pbt.mintTokenWithChip(signature, blockNumber, nonce1);

    vm.prank(user2);
    uint256 nonce2 = pbt.getNonce();
    payload = abi.encodePacked(user2, blockhash(blockNumber), nonce2);
    signature = _createSignature(payload, 102);

    vm.prank(user2);
    uint256 tokenId2 = pbt.mintTokenWithChip(signature, blockNumber, nonce2);
    string memory uri = pbt.tokenURI(tokenId1);
    // updateChips should now succeed
    vm.expectEmit(true, true, true, true);
    emit PBTChipRemapping(tokenId1, chipAddr1, chipAddr3);
    vm.expectEmit(true, true, true, true);
    emit PBTChipRemapping(tokenId2, chipAddr2, chipAddr4);
    pbt.updateChips(oldChips, newChips);

    // Verify the call works as inteded
    AmhoPBT.TokenData memory td = pbt.getTokenData(chipAddr1);
    assertEq(td.set, false);
    assertEq(td.tokenId, 0);
    assertEq(td.chipAddress, address(0));

    td = pbt.getTokenData(chipAddr2);
    assertEq(td.set, false);
    assertEq(td.tokenId, 0);
    assertEq(td.chipAddress, address(0));

    td = pbt.getTokenData(chipAddr3);
    assertEq(td.set, true);
    assertEq(td.tokenId, tokenId1);
    assertEq(td.chipAddress, chipAddr3);

    td = pbt.getTokenData(chipAddr4);
    assertEq(td.set, true);
    assertEq(td.tokenId, tokenId2);
    assertEq(td.chipAddress, chipAddr4);
  }

  function testTokenIdFor() public {
    vm.expectRevert(NoMintedTokenForChip.selector);
    pbt.tokenIdFor(chipAddr1);

    vm.roll(blockNumber + 1);

    vm.startPrank(user1);
    uint256 nonce1 = pbt.getNonce();
    bytes memory payload = abi.encodePacked(user1, blockhash(blockNumber), nonce1);
    bytes memory signature = _createSignature(payload, 101);

    address[] memory chipAddresses = new address[](1);
    chipAddresses[0] = chipAddr1;
    pbt.seedChipAddresses(chipAddresses, floatSupply);

    uint256 nonce2 = pbt.getNonce();
    uint256 tokenId = pbt.mintTokenWithChip(signature, blockNumber, nonce2);
    assertEq(pbt.tokenIdFor(chipAddr1), tokenId);
  }

  function testTransferTokenWithChip(bool useSafeTransfer) public withSeededChips {
    vm.roll(blockNumber + 1);

    vm.prank(user1);
    uint256 nonce1 = pbt.getNonce();
    bytes memory payload = abi.encodePacked(user1, blockhash(blockNumber), nonce1);
    bytes memory signature = _createSignature(payload, 101);

    vm.prank(user1);
    uint256 tokenId = pbt.mintTokenWithChip(signature, blockNumber, nonce1);
    assertEq(pbt.ownerOf(tokenId), user1);

    vm.roll(blockNumber + 10);
    vm.prank(user2);
    uint256 nonce2 = pbt.getNonce();
    payload = abi.encodePacked(user2, blockhash(blockNumber + 9), nonce2);
    signature = _createSignature(payload, 101);

    vm.prank(user2);
    pbt.transferTokenWithChip(signature, blockNumber + 9, useSafeTransfer, nonce2);
    assertEq(pbt.ownerOf(tokenId), user2);
  }

  function testGetTokenDataForChipSignatureInvalid() public withSeededChips {
    vm.roll(blockNumber + 1);

    vm.startPrank(user1);
    uint256 nonce1 = pbt.getNonce();
    bytes memory payload = abi.encodePacked(user1, blockhash(blockNumber), nonce1);
    bytes memory signature = _createSignature(payload, 101);

    vm.expectRevert(InvalidSignature.selector);
    pbt.getTokenDataForChipSignature(signature, blockNumber, nonce1);

    uint256 nonce2 = pbt.getNonce();
    pbt.mintTokenWithChip(signature, blockNumber, nonce2);

    // Current block number is the same as the signature block number which is invalid
    uint256 nonce3 = pbt.getNonce();
    vm.expectRevert(InvalidBlockNumber.selector);
    pbt.getTokenDataForChipSignature(signature, blockNumber + 1, nonce3);

    // Block number used in signature is too old
    vm.roll(blockNumber + 101);
    uint256 nonce4 = pbt.getNonce();
    vm.expectRevert(BlockNumberTooOld.selector);
    pbt.getTokenDataForChipSignature(signature, blockNumber, nonce4);
  }

  function testGetTokenDataForChipSignature() public withSeededChips {
    vm.roll(blockNumber + 1);

    vm.startPrank(user1);
    uint256 nonce1 = pbt.getNonce();
    bytes memory payload = abi.encodePacked(user1, blockhash(blockNumber), nonce1);
    bytes memory signature = _createSignature(payload, 101);
    uint256 tokenId = pbt.mintTokenWithChip(signature, blockNumber, nonce1);
    vm.stopPrank();

    vm.startPrank(user1);
    uint256 nonce2 = pbt.getNonce();
    bytes memory payload2 = abi.encodePacked(user1, blockhash(blockNumber), nonce2);
    bytes memory signature2 = _createSignature(payload2, 101);
    AmhoPBT.TokenData memory td = pbt.getTokenDataForChipSignature(signature2, blockNumber, nonce2);
    assertEq(td.set, true);
    assertEq(td.chipAddress, chipAddr1);
    assertEq(td.tokenId, tokenId);
  }

  function testSupportsInterface() public {
    assertEq(pbt.supportsInterface(type(IPBT).interfaceId), true);
    assertEq(pbt.supportsInterface(type(IERC721).interfaceId), true);
  }
}
