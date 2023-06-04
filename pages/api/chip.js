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
  static=41045719801D4891580CF3542D4A9A1B7C109947730720C303257C4BC5DBD79062D18BC7519F2ECE1F71FA40A670D8329590FD40228A9F54A07C339602331E18A67E41049CAB719255433733A86080DD4878A94BE0C345CFD9AECED3E56E6BB016B1EE8ACC65F1078485F851111950D2ED4AC194508F82EF8C3F35C9DF4B0AA570BC9EF7000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000&
  latch1=0000000000000000000000000000000000000000000000000000000000000000&
  latch2=0000000000000000000000000000000000000000000000000000000000000000&
  cmd=01014051FAED7CA8D56E8D843258A7E7CF4D3D273800E84E6154C8FCA60F94917EE200&
  res=304602210093E6E4E3F27B8D07DDA643260C527A6576FD803A0B07732F7380E7FAF8BB56C7022100F078DA826AED7E5C36867B0639D53B30DEDC989610FD7853AF210C34FAED670F00000000`
  const parsed = parseURLParams(params)

  const example = `?v=c3`
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
