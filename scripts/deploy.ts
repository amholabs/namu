import { ethers } from 'hardhat'

import updateEnvVar from './helpers/updateEnvVar'

async function main() {
  const [owner] = await ethers.getSigners()
  console.log(owner)
  const ChipTable = await ethers.getContractFactory('ChipTable')
  const chipTable = await ChipTable.deploy(owner.address, '1')

  const PBTSimple = await ethers.getContractFactory('PBTSimple')
  const pbtSimple = await PBTSimple.deploy('ENIGMA FW 2023', 'ETIXFW2023')

  await chipTable.deployed()
  await pbtSimple.deployed()

  console.log(`ChipTable address deployed to ${chipTable.address}`)
  console.log(`PBTSimple address deployed to ${pbtSimple.address}`)

  updateEnvVar('ENS_REGISTRY', chipTable.address, './.env.local')
  updateEnvVar('PBT_ADDRESS', pbtSimple.address, './.env.local')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
