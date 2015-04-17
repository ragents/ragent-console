// Licensed under the Apache License. See footer for details.

var url  = require("url")
var path = require("path")

var ragentConsole = require(".")

var PROGRAM = path.basename(__filename).split(".")[0]

//------------------------------------------------------------------------------
function main() {
  process.env.RAGENTS_URL = getRagentsURL()

  ragentConsole.attach(attached)
}

//------------------------------------------------------------------------------
function attached(err) {
  if (err) {
    log(err)
    process.exit(1)
  }

  log("attached to ragents server")

  // from here on, messages sent to console AND as ragents events
  ragentConsole.install()

  every(2000, doLog)
  every(3000, doInfo)
  every(4000, doWarn)
  every(5000, doError)
}

//------------------------------------------------------------------------------
function every(ms, fn) {
  setInterval(fn, ms)
}

//------------------------------------------------------------------------------
var lCounter = 0, iCounter = 0, wCounter = 0, eCounter = 0

function doLog()   { console.log(  "message type: log",   lCounter++) }
function doInfo()  { console.info( "message type: info",  iCounter++) }
function doWarn()  { console.warn( "message type: warn",  wCounter++) }
function doError() { console.error("message type: error", eCounter++) }

//------------------------------------------------------------------------------
function getRagentsURL() {
  var rurl
  var where

  if (process.env.RAGENTS_URL) {
    where  = "RAGENTS_URL environment variable"
    rurl = process.env.RAGENTS_URL
  }
  else if (process.argv[2]){
    where  = "command-line argument"
    rurl = process.argv[2]
  }
  else {
    log("expecting url to ragents service as command-line argument or RAGENTS_URL environment variable")
    process.exit(1)
  }

  var result = url.parse(rurl)
  // console.log(JSON.stringify(result, null, 4))

  if (result.protocol == "http:")  result.protocol = "ws:"
  if (result.protocol == "https:") result.protocol = "wss:"

  if ((result.protocol != "ws:") && (result.protocol != "wss:")) {
    log("ragents url from " + where + " must have http:, https:, ws:, or wss: protocol")
    process.exit(1)
  }

  if (!result.hash || (result.hash == "")) {
    log("ragents url from " + where + " needs a session key as a fragment")
    process.exit(1)
  }

  return url.format(result)
}

//------------------------------------------------------------------------------
function log(message) {
  console.log(PROGRAM + ": " + message)
}

//------------------------------------------------------------------------------
main()

//------------------------------------------------------------------------------
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------
