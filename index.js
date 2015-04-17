// Licensed under the Apache License. See footer for details.

var path = require("path")
var util = require("util")

var ragents = require("ragents")

var PROGRAM = path.basename(__filename).split(".")[0]

//------------------------------------------------------------------------------
exports.attach    = attach
exports.install   = install
exports.uninstall = uninstall

var RagentsSession = null
var Agent          = null

//------------------------------------------------------------------------------
function attach(cb) {
  var config = getSessionConfig()
  cb = cb || defaultAttachCB(config)

  if (null == config) return cb(new Error("unable to determine ragent server or session key"))

  ragents.createSession(config, sessionCreated)

  //-----------------------------------
  function sessionCreated(err, session) {
    if (err) return cb(err)

    RagentsSession = session

    session.on("close", function() {
      RagentsSession = null
    })

    var agentInfo = {
      name: "ragent-console",
      title: process.argv.join(" ")
    }

    session.createAgent(agentInfo, agentCreated)
  }

  //-----------------------------------
  function agentCreated(err, agent) {
    if (err) return cb(err)

    Agent = agent
    cb()
  }
}

//------------------------------------------------------------------------------
function defaultAttachCB(config) {
  return function(err) {
    if (err && !config) {
      console.log(err)
      return
    }

    if (err) {
      console.log("error attaching to " + config.url + ": " + err)
    }
  }
}

//------------------------------------------------------------------------------
function emitEvent(type, args) {
  if (!RagentsSession) return
  if (!Agent) return

  var message = util.format.apply(util, args)

  Agent.emit("console", {
    type:    type,
    message: message
  })
}

//------------------------------------------------------------------------------
var OrigConsoleMethods = {
  log:   console.log,
  info:  console.info,
  warn:  console.warn,
  error: console.error
}

//------------------------------------------------------------------------------
function install() {
  console.log   = NewConsoleLog
  console.info  = NewConsoleInfo
  console.warn  = NewConsoleWarn
  console.error = NewConsoleError
}

//------------------------------------------------------------------------------
function uninstall() {
  console.log   = OrigConsoleMethods.log
  console.info  = OrigConsoleMethods.info
  console.warn  = OrigConsoleMethods.warn
  console.error = OrigConsoleMethods.error
}

//------------------------------------------------------------------------------
function NewConsoleLog() {
  OrigConsoleMethods.log.apply(console, arguments)
  emitEvent("log", arguments)
}

//------------------------------------------------------------------------------
function NewConsoleInfo() {
  OrigConsoleMethods.info.apply(console, arguments)
  emitEvent("info", arguments)
}

//------------------------------------------------------------------------------
function NewConsoleWarn() {
  OrigConsoleMethods.warn.apply(console, arguments)
  emitEvent("warn", arguments)
}

//------------------------------------------------------------------------------
function NewConsoleError() {
  OrigConsoleMethods.error.apply(console, arguments)
  emitEvent("error", arguments)
}

//------------------------------------------------------------------------------
function getSessionConfig() {
  var url
  if (process.browser) {
    url = localStorage.RAGENTS_URL
  }
  else {
    url = process.env.RAGENTS_URL
  }

  if (!url) return null

  var key = "anonymous"

  var match = url.match(/(.*?)#(.*)/)
  if (!match) {
    return {url: url, key: key}
  }
  else {
    return {url: match[1], key: match[2]}
  }
}

//------------------------------------------------------------------------------
function log() {
  var message = util.format.apply(util, arguments)
  OrigConsoleMethods.log.call(console, PROGRAM + ": " + message)
}


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
