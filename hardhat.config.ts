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
import fs from 'fs'

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || './.env.local'
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) })

// function getRemappings() {
//   return fs
//     .readFileSync('remappings.txt', 'utf8')
//     .split('\n')
//     .filter(Boolean) // remove empty lines
//     .map((line) => line.trim().split('='))
// }

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  defaultNetwork: 'goerli',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.USERA_PRIVATEKEY}`, `0x${process.env.USERB_PRIVATEKEY}`],
    },
  },
  // preprocess: {
  //   eachLine: (hre) => ({
  //     transform: (line: string) => {
  //       if (line.match(/^\s*import /i)) {
  //         for (const [from, to] of getRemappings()) {
  //           if (line.includes(from)) {
  //             line = line.replace(from, to)
  //             break
  //           }
  //         }
  //       }
  //       return line
  //     },
  //   }),
  // },
  // paths: {
  //   artifacts: './artifacts',
  //   tests: './test/hardhat',
  //   sources: './contracts-hardhat/',
  //   cache: './cache_hardhat',
  // },
}

export default config
