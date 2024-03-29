import abi from 'ethereumjs-abi'
import { ethers } from 'ethers'
import { goerli } from 'wagmi'

import { ETH_CHAINS } from '@/lib/constants'
// import { PBT_ADDRESS } from 'config'

type OxString = `0x${string}`

type NameTypeData = {
  name: string
  type: string
}

type DomainData = {
  name: string
  version: string
  salt?: string
  verifyingContract?: string
}
interface HelperAttributes {
  ZERO_ADDRESS: OxString
  baseURL: string
  biconomyForwarderAbi: any[]
  biconomyForwarderDomainData: DomainData
  domainType: NameTypeData[]
  forwardRequestType: NameTypeData[]
}

let helperAttributes: HelperAttributes = {
  // generate default state for HelperAttributes type
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  baseURL: '',
  biconomyForwarderAbi: [],
  biconomyForwarderDomainData: {
    name: '',
    version: '',
  },
  domainType: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ],
  forwardRequestType: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'token', type: 'address' },
    { name: 'txGas', type: 'uint256' },
    { name: 'tokenGasPrice', type: 'uint256' },
    { name: 'batchId', type: 'uint256' },
    { name: 'batchNonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
    { name: 'data', type: 'bytes' },
  ],
}
// let supportedNetworks = [goerli.id] //add more

helperAttributes.ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
helperAttributes.baseURL = 'https://api.biconomy.io'
// any other constants needed goes in helperAttributes

helperAttributes.biconomyForwarderAbi = [
  { inputs: [{ internalType: 'address', name: '_owner', type: 'address' }], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'domainSeparator', type: 'bytes32' },
      { indexed: false, internalType: 'bytes', name: 'domainValue', type: 'bytes' },
    ],
    name: 'DomainRegistered',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'txGas', type: 'uint256' },
          { internalType: 'uint256', name: 'tokenGasPrice', type: 'uint256' },
          { internalType: 'uint256', name: 'batchId', type: 'uint256' },
          { internalType: 'uint256', name: 'batchNonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        internalType: 'struct ERC20ForwardRequestTypes.ERC20ForwardRequest[]',
        name: 'reqs',
        type: 'tuple[]',
      },
      { internalType: 'bytes32', name: 'domainSeparator', type: 'bytes32' },
      { internalType: 'bytes[]', name: 'sigs', type: 'bytes[]' },
    ],
    name: 'executeBatchEIP712',
    outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'txGas', type: 'uint256' },
          { internalType: 'uint256', name: 'tokenGasPrice', type: 'uint256' },
          { internalType: 'uint256', name: 'batchId', type: 'uint256' },
          { internalType: 'uint256', name: 'batchNonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        internalType: 'struct ERC20ForwardRequestTypes.ERC20ForwardRequest[]',
        name: 'reqs',
        type: 'tuple[]',
      },
      { internalType: 'bytes[]', name: 'sigs', type: 'bytes[]' },
    ],
    name: 'executeBatchPersonalSign',
    outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'txGas', type: 'uint256' },
          { internalType: 'uint256', name: 'tokenGasPrice', type: 'uint256' },
          { internalType: 'uint256', name: 'batchId', type: 'uint256' },
          { internalType: 'uint256', name: 'batchNonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        internalType: 'struct ERC20ForwardRequestTypes.ERC20ForwardRequest',
        name: 'req',
        type: 'tuple',
      },
      { internalType: 'bytes32', name: 'domainSeparator', type: 'bytes32' },
      { internalType: 'bytes', name: 'sig', type: 'bytes' },
    ],
    name: 'executeEIP712',
    outputs: [
      { internalType: 'bool', name: 'success', type: 'bool' },
      { internalType: 'bytes', name: 'ret', type: 'bytes' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'version', type: 'string' },
    ],
    name: 'registerDomainSeparator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'domains',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'EIP712_DOMAIN_TYPE',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'uint256', name: 'batchId', type: 'uint256' },
    ],
    name: 'getNonce',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'isOwner', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'owner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  {
    inputs: [],
    name: 'REQUEST_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'txGas', type: 'uint256' },
          { internalType: 'uint256', name: 'tokenGasPrice', type: 'uint256' },
          { internalType: 'uint256', name: 'batchId', type: 'uint256' },
          { internalType: 'uint256', name: 'batchNonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        internalType: 'struct ERC20ForwardRequestTypes.ERC20ForwardRequest',
        name: 'req',
        type: 'tuple',
      },
      { internalType: 'bytes32', name: 'domainSeparator', type: 'bytes32' },
      { internalType: 'bytes', name: 'sig', type: 'bytes' },
    ],
    name: 'verifyEIP712',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'txGas', type: 'uint256' },
          { internalType: 'uint256', name: 'tokenGasPrice', type: 'uint256' },
          { internalType: 'uint256', name: 'batchId', type: 'uint256' },
          { internalType: 'uint256', name: 'batchNonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        internalType: 'struct ERC20ForwardRequestTypes.ERC20ForwardRequest',
        name: 'req',
        type: 'tuple',
      },
      { internalType: 'bytes', name: 'sig', type: 'bytes' },
    ],
    name: 'verifyPersonalSign',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
]

helperAttributes.biconomyForwarderDomainData = {
  name: 'Biconomy Forwarder',
  version: '1',
}

helperAttributes.domainType = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'verifyingContract', type: 'address' },
  { name: 'salt', type: 'bytes32' },
]

helperAttributes.forwardRequestType = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'token', type: 'address' },
  { name: 'txGas', type: 'uint256' },
  { name: 'tokenGasPrice', type: 'uint256' },
  { name: 'batchId', type: 'uint256' },
  { name: 'batchNonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
  { name: 'data', type: 'bytes' },
]
type ContractAddresses = {
  biconomyForwarderAddress: string
}
// pass the networkId to get contract addresses
const getContractAddresses = async (networkId: string) => {
  let contractAddresses: ContractAddresses = {
    biconomyForwarderAddress: process.env.NEXT_PUBLIC_BICONOMY_FORWARDER_ADDRESS || '',
  }
  const apiInfo = `${helperAttributes.baseURL}/api/v2/meta-tx/systemInfo?networkId=${networkId}`
  const response = await fetch(apiInfo)
  const systemInfo = await response.json()
  console.log('Response JSON ' + JSON.stringify(systemInfo))
  contractAddresses.biconomyForwarderAddress = systemInfo.biconomyForwarderAddress
  return contractAddresses
}

/**
 * Returns ABI and contract address based on network Id
 * You can build biconomy forwarder contract object using above values and calculate the nonce
 * @param {*} networkId
 */
const getBiconomyForwarderConfig = async (networkId: number) => {
  //get trusted forwarder contract address from network id
  const contractAddresses = await getContractAddresses(networkId.toString())
  const forwarderAddress = contractAddresses.biconomyForwarderAddress
  return { abi: helperAttributes.biconomyForwarderAbi, address: forwarderAddress }
}

/**
 * pass the below params in any order e.g. account=<account>,batchNone=<batchNone>,...
 * @param {*}  account - from (end user's) address for this transaction
 * @param {*}  to - target recipient contract address
 * @param {*}  gasLimitNum - gas estimation of your target method in numeric format
 * @param {*}  batchId - batchId
 * @param {*}  batchNonce - batchNonce which can be verified and obtained from the biconomy forwarder
 * @param {*}  data - functionSignature of target method
 * @param {*}  deadline - optional deadline for this forward request
 */
export type BuildForwardTxRequestParams = {
  account: OxString | undefined
  to: OxString | undefined
  gasLimitNum: number
  batchId: number
  batchNonce: string
  data: string
  deadline?: number
}

// create type for return value of buildForwardTxRequest
export type BuildForwardTxRequestReturn = {
  from: OxString | undefined
  to: OxString | undefined
  token: OxString
  txGas: number
  tokenGasPrice: string
  batchId: number
  batchNonce: number
  deadline: number
  data: string
}

const buildForwardTxRequest = async ({
  account,
  to,
  gasLimitNum,
  batchId,
  batchNonce,
  data,
  deadline,
}: BuildForwardTxRequestParams): Promise<any> => {
  const req = {
    from: account,
    to: to,
    token: '0x0000000000000000000000000000000000000000',
    txGas: gasLimitNum,
    tokenGasPrice: '0',
    batchId: typeof batchId == 'number' ? batchId : parseInt(batchId),
    batchNonce: parseInt(batchNonce),
    deadline: deadline || Math.floor(Date.now() / 1000 + 3600),
    data: data,
  }
  return req
}

/**
 * pass your forward request and network Id
 * use this method to build message to be signed by end user in EIP712 signature format
 * @param {*} request - forward request object
 * @param {*} networkId
 */
const getDataToSignForEIP712 = async (request: string, networkId: string) => {
  const contractAddresses = await getContractAddresses(networkId)
  const forwarderAddress = contractAddresses.biconomyForwarderAddress
  let domainData: DomainData = helperAttributes.biconomyForwarderDomainData
  domainData.salt = ethers.utils.hexZeroPad(ethers.BigNumber.from(networkId).toHexString(), 32)
  domainData.verifyingContract = forwarderAddress

  const dataToSign = JSON.stringify({
    types: {
      EIP712Domain: helperAttributes.domainType,
      ERC20ForwardRequest: helperAttributes.forwardRequestType,
    },
    domain: domainData,
    primaryType: 'ERC20ForwardRequest',
    message: request,
  })
  return dataToSign
}

/**
 * pass your forward request
 * use this method to build message to be signed by end user in personal signature format
 * @param {*} networkId
 */
// based on the body of getDataToSignForPersonalSign method, generate typescript types
export type ForwardRequest = {
  from: OxString | undefined
  to: OxString | undefined
  token: OxString
  txGas: number
  tokenGasPrice: string
  batchId: number
  batchNonce: number
  deadline: number
  data: string
}

const getDataToSignForPersonalSign = async (request: ForwardRequest) => {
  const hashToSign = await abi.soliditySHA3(
    ['address', 'address', 'address', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'bytes32'],
    [
      request.from,
      request.to,
      request.token,
      request.txGas,
      request.tokenGasPrice,
      request.batchId,
      request.batchNonce,
      request.deadline,
      ethers.utils.keccak256(request.data),
    ]
  )
  return hashToSign
}

/**
 * get the domain seperator that needs to be passed while using EIP712 signature type
 * @param {*} networkId
 */
const getDomainSeperator = async (networkId: string) => {
  const contractAddresses = await getContractAddresses(networkId)
  const forwarderAddress = contractAddresses.biconomyForwarderAddress
  let domainData = helperAttributes.biconomyForwarderDomainData
  domainData.salt = ethers.utils.hexZeroPad(ethers.BigNumber.from(networkId).toHexString(), 32)
  domainData.verifyingContract = forwarderAddress

  const domainSeparator = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'address', 'bytes32'],
      [
        ethers.utils.id('EIP712Domain(string name,string version,address verifyingContract,bytes32 salt)'),
        ethers.utils.id(domainData.name),
        ethers.utils.id(domainData.version),
        domainData.verifyingContract,
        domainData.salt,
      ]
    )
  )
  return domainSeparator
}
type SendTransactionParams = {
  userAddress: OxString | undefined
  request: any
  sig: OxString | undefined
  domainSeparator?: string
  signatureType: string
}

const sendTransaction = async ({ userAddress, request, sig, domainSeparator, signatureType }: SendTransactionParams) => {
  let params
  if (domainSeparator) {
    params = [request, domainSeparator, sig]
  } else {
    params = [request, sig]
  }
  try {
    const response = await fetch(`https://api.biconomy.io/api/v2/meta-tx/native`, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_BICONOMY_API_KEY || '',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        to: process.env.NEXT_PUBLIC_PBT_ADDRESS,
        apiId: process.env.NEXT_PUBLIC_BICONOMY_API_ID,
        params: params,
        from: userAddress,
        signatureType: signatureType,
      }),
    })
    const result = await response.json()
    return result.txHash
  } catch (error) {
    console.log(error)
    return error
  }
}
export {
  helperAttributes,
  buildForwardTxRequest,
  getDomainSeperator,
  getDataToSignForPersonalSign,
  getDataToSignForEIP712,
  getBiconomyForwarderConfig,
  sendTransaction,
}
