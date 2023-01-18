const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../ceramic/.env') })

const filePathSchema = path.join(__dirname, '..', '..', 'ceramic', 'schemas')

function updateUl(filename) {
  const fullPath = path.join(filePathSchema, `${filename}`)
  const profileStreamId = process.env.NEXT_PROFILE_STREAM_ID
  const regex = 'id: "[0-9a-z]?.*"'
  fs.readFile(fullPath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    let match = data.match(regex)
    let result = data.replace(match, `id: "${profileStreamId}"`)
    fs.writeFile(fullPath, result, 'utf8', function (err) {
      if (err) return console.log(err)
    })
  })
}

function updateP(filename) {
  const fullPath = path.join(filePathSchema, `${filename}`)
  const ulStreamId = process.env.URLLINK_STREAM_ID
  const regex = 'id: "[0-9a-z]?.*"'
  fs.readFile(fullPath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    let match = data.match(regex)
    let result = data.replace(match, `id: "${ulStreamId}"`)
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
