const { expect } = require('chai')

describe('Generate a personal signature', function () {
  it('Deploying Personal Signature Drop should work', async function () {
    const contract = await ethers.getContractFactory('PersonalSignatureDrop')
    const deployedContract = await contract.deploy()
    await deployedContract.deployed()
  })
})
