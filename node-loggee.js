// Licensed under the Apache License. See footer for details.

var url  = require("url")
var path = require("path")

var chalk   = require("chalk")
var ragents = require("ragents")

var PROGRAM = path.basename(__filename).split(".")[0]

//------------------------------------------------------------------------------
function main() {
  var rurl  = getRagentsURL()
  var rurlp = url.parse(rurl)
  var key   = rurlp.hash.substr(1)

  rurlp.hash = null
  rurl = url.format(rurlp)

  var config = { url: rurl, key: key}
  log("creating ragents session")
  ragents.createSession(config, sessionCreated)
}

//------------------------------------------------------------------------------
function sessionCreated(err, session) {
  if (err) {
    log("error creating session:", err)
    process.exit(1)
  }

  log("ragents session created")

  session.on("close", onSessionClose)
  session.on("ragentCreated", ragentCreated)
  session.getRemoteAgents(gotRemoteAgents)
}

//------------------------------------------------------------------------------
function onSessionClose() {
  log("ragents session closed")
  process.exit(0)
}

//------------------------------------------------------------------------------
function ragentCreated(ragent) {
  if (ragent.info.name != "ragent-console") return

  log("listening to console for [" + ragent.info.id + "] " + ragent.info.title)
  ragent.on("console", onConsole(ragent.info.id))
}

//------------------------------------------------------------------------------
function onConsole(ragentID) {
  return function (event) {
    var type    = event.type
    var message = event.message

    switch(type) {
      case "log":   message = chalk.blue(message); break
      case "info":  message = chalk.green(message); break
      case "warn":  message = chalk.yellow(message); break
      case "error": message = chalk.red(message); break
    }

    message = "[" + ragentID + "] " + message
    console.log(message)
  }
}

//------------------------------------------------------------------------------
function gotRemoteAgents(err, ragents) {
  if (err) {
    log("error getting remote agents:", err)
    process.exit(1)
  }

  ragents.forEach(ragentCreated)
}

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
