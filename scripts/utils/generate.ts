import updateEnvVar from '../helpers/updateEnvVar'

const path = require('path')
const jq = require('node-jq')

const args = process.argv.slice(2)

async function main() {
  // take in args from command line
  const filePathConfig = path.join(__dirname, '..', '..', 'ceramic', '.env')
  const filePathCeramic = path.join(__dirname, '..', '..', 'ceramic')
  const filePathJson = path.join(filePathCeramic, `${args[0].toLowerCase()}.json`)
  const filter = '.models | keys[0]'
  // @ts-ignore
  jq.run(filter, filePathJson, {}).then((output) => {
    let streamId = output.toString()
    let varName = `NEXT_${args[0].toUpperCase()}_STREAM_ID`
    updateEnvVar(varName, streamId, filePathConfig)
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
