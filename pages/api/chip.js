// import parseKeys from '../../scripts/helpers/parseKeys'
// import { ethers } from 'ethers'
// import abi from '../../artifacts/contracts/ChipTable.sol/ChipTable.json'
import { parseURLParams } from 'halo-chip'

// const abi = getAbi(path);
const ENS_REGISTRY = process.env.ENS_REGISTRY
const ENS_NETWORK = process.env.ENS_NETWORK

// a function that takes a json path and returns the abi
export default async function handler(req, res) {
  // const provider = new ethers.providers.JsonRpcProvider(ENS_NETWORK)

  const params = `?v=c3&
  static=&
  latch1=0000000000000000000000000000000000000000000000000000000000000000&
  latch2=0000000000000000000000000000000000000000000000000000000000000000&
  cmd=81020000001B8F48E0B1A3B19C5DF8D763717A7BE27475FA6AF0E34F8449704C3A8B00&
  res=3046022100D5871CDE09C5AB891F4D023EC278DF8F1CE5B6970F478C825D812C946F15593B022100EA326B2683E212F34CF87C051CF0BA00BCD1530B72FE8D8754584F480C38ED3400000000`
  const example = `?v=c3`
  const parsed = parseURLParams(params)
  console.log(parsed)
  // create a contract instance using the ENS_REGISTRY address and the ENS ABI
  // const contract = new ethers.Contract(ENS_REGISTRY, abi.abi, provider)

  // const url = new URL(window.location.href, true);

  // check if url.query.static is not undefined else parseKeys from url.query.static
  // const chipId = req.query.static ? parseKeys(req.query.static) : parseKeys(req.query.dynamic)
  // if chipId if not undefined call chipExists
  // const exists = await contract.chipExists(chipId)

  // if (exists) {
  // console.log(exists)
  // } else {
  // console.log('does not exist', exists)
  // }
}
