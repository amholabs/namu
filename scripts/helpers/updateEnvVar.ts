import fs from 'fs'
import os from 'os'

export default function updateEnvVar(key: string, value: string, path: string = './.env.local') {
  // read file from hdd & split if from a linebreak to a array
  const ENV_VARS: any = fs.readFileSync(path, 'utf8').split(os.EOL)

  // find the env we want based on the key
  const target = ENV_VARS.indexOf(
    ENV_VARS.find((line: any) => {
      const keyValRegex = new RegExp(`(?<!#\\s*)${key}(?==)`)

      return line.match(keyValRegex)
    })
  )

  // if key-value pair exists in the .env file,
  if (target !== -1) {
    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`)
  } else {
    // if it doesn't exist, add it instead
    ENV_VARS.push(`${key}=${value}`)
  }

  // write everything back to the file system
  fs.writeFileSync(path, ENV_VARS.join(os.EOL))
}
