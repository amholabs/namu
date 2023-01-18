import updateEnvVar from '../helpers/updateEnvVar'

const { exec } = require('child_process')

async function main() {
  // call the setip.sh script using the os library and store the STDOUT in a variable
  switch (process.env.NODE_ENV) {
    case 'test':
      exec(`./setip.sh`, (err: string, stdout: string, stderr: string) => {
        updateEnvVar('NEXT_LOCAL_IP', stdout, './.env.test')
      })
    case 'development':
      exec(`./setip.sh`, (err: string, stdout: string, stderr: string) => {
        updateEnvVar('NEXT_LOCAL_IP', stdout, './.env.local')
      })
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
