import fs from 'fs'

import { ethers } from 'hardhat'

import updateEnvVar from './helpers/updateEnvVar'

async function main() {
  // const [owner] = await ethers.getSigners()
  // console.log(owner)
  // const ChipTable = await ethers.getContractFactory('ChipTable')
  // const chipTable = await ChipTable.deploy(owner.address, '1')

  const AmhoPBT = await ethers.getContractFactory('AmhoPBTMock')
  const amhoPBT = await AmhoPBT.deploy('AMHO CAMPAIGN', 'AMHOTIX', 1000, '0x84a0856b038eaAd1cC7E297cF34A7e72685A8693')

  console.log(`AmhoPBT address deployed to ${amhoPBT.address}`)

  updateEnvVar('PBT_ADDRESS', amhoPBT.address, './.env.local')
  fs.writeFileSync('./config.ts', `export const PBT_ADDRESS = '${amhoPBT.address}'`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
