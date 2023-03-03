// eslint-disable-next-line import/order
import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-foundry'
import 'hardhat-preprocessor'

// eslint-disable-next-line import/order
import { config as dotenvConfig } from 'dotenv'

// eslint-disable-next-line import/order
import { resolve } from 'path'

// eslint-disable-next-line import/order

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || './.env.local'
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) })

const config: HardhatUserConfig = {
  solidity: '0.8.13',
  defaultNetwork: 'goerli',
  networks: {
    localhost: {
      url: 'https://amholoc.tunnelto.dev/',
      accounts: [`0x${process.env.USERA_PRIVATEKEY}`, `0x${process.env.USERB_PRIVATEKEY}`],
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_goeETH}`,
      accounts: [`0x${process.env.USERA_PRIVATEKEY}`, `0x${process.env.USERB_PRIVATEKEY}`],
      gasPrice: 'auto',
      gasMultiplier: 1.1,
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_mainETH}`,
      accounts: [`0x${process.env.USERA_PRIVATEKEY}`, `0x${process.env.USERB_PRIVATEKEY}`],
      gasPrice: 'auto',
    },
    sepolia: {
      url: `https://prettiest-autumn-field.ethereum-sepolia.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_API_KEY}/`,
      accounts: [`0x${process.env.USERC_PRIVATEKEY}`],
    },
  },
}

export default config
