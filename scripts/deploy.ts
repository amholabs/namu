import fs from 'fs'

import { ethers } from 'hardhat'

import updateEnvVar from './helpers/updateEnvVar'

async function main() {
  // const [owner] = await ethers.getSigners()
  // console.log(owner)
  // const ChipTable = await ethers.getContractFactory('ChipTable')
  // const chipTable = await ChipTable.deploy(owner.address, '1')

  const PBTSimpleMock = await ethers.getContractFactory('PBTSimpleMock')
  const pbtSimple = await PBTSimpleMock.deploy('ENIGMA FW 2023', 'ETIXFW2023')
  // await chipTable.deployed()
  await pbtSimple.deployed()

  console.log(`PBTSimpleMock address deployed to ${pbtSimple.address}`)

  updateEnvVar('PBT_ADDRESS', pbtSimple.address, './.env.local')
  fs.writeFileSync('./config.js', `export const PBT_ADDRESS = '${pbtSimple.address}'`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
