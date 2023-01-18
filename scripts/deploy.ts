import { ethers } from 'hardhat'

import updateEnvVar from './helpers/updateEnvVar'

async function main() {
  const [owner] = await ethers.getSigners()
  const ChipTable = await ethers.getContractFactory('ChipTable')
  const chipTable = await ChipTable.deploy(owner.address, '1')

  await chipTable.deployed()

  console.log(`ChipTable address deployed to ${chipTable.address}`)
  updateEnvVar('ENS_REGISTRY', chipTable.address, './.env.local')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
