import fs from 'fs'
import path from 'path'

export default function getAbi(pathName) {
  try {
    const dir = path.resolve(__dirname, pathName)
    const file = fs.readFileSync(dir, 'utf8')
    const json = JSON.parse(file)
    const abi = json.abi
    console.log(`abi`, abi)

    return abi
  } catch (e) {
    console.log(`e`, e)
  }
}
