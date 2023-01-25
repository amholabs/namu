// @ts-ignore
const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../ceramic/.env') })

const filePathSchema = path.join(__dirname, '..', '..', 'ceramic', 'schemas')

// @ts-ignore
function updateUl(filename) {
  const fullPath = path.join(filePathSchema, `${filename}`)
  const profileStreamId = process.env.NEXT_PROFILE_STREAM_ID
  const regex = 'id: "[0-9a-z]?.*"'
  // @ts-ignore
  fs.readFile(fullPath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    let match = data.match(regex)
    // @ts-ignore
    let result = data.replace(match, `id: "${profileStreamId}"`)
    // @ts-ignore
    fs.writeFile(fullPath, result, 'utf8', function (err) {
      if (err) return console.log(err)
    })
  })
}

// @ts-ignore
function updateP(filename) {
  const fullPath = path.join(filePathSchema, `${filename}`)
  const ulStreamId = process.env.URLLINK_STREAM_ID
  const regex = 'id: "[0-9a-z]?.*"'
  // @ts-ignore
  fs.readFile(fullPath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    let match = data.match(regex)
    // @ts-ignore
    let result = data.replace(match, `id: "${ulStreamId}"`)
    // @ts-ignore
    fs.writeFile(fullPath, result, 'utf8', function (err) {
      if (err) return console.log(err)
    })
  })
}

module.exports = {
  updateP,
  updateUl,
}
require('make-runnable')
