// Licensed under the Apache License. See footer for details.

var app = angular.module("app", [])
app.controller("BodyController", BodyController)

//------------------------------------------------------------------------------
function BodyController($scope) {
  $scope.ragentsURL    = getRagentsURL()
  $scope.messages      = []
  $scope.connect       = connect
  $scope.clearMessages = clearMessages

  disconnected($scope)

  $scope.connect()

  //-----------------------------------
  function connect() {
    var config = {
      url: $scope.ragentsURL,
      key: "anonymous"
    }

    var match = $scope.ragentsURL.match(/(.*?)#(.*)/)
    if (match) {
      config.url = match[1]
      config.key = match[2]
    }

    ragents.createSession(config, sessionCreated)
  }

  //-----------------------------------
  function clearMessages() {
    $scope.messages = []
  }

  //-----------------------------------
  function sessionCreated(err, session) {
    if (err) return alert("error creating session: " + err)

    connected($scope)

    session.on("ragentCreated", ragentCreated)

    session.getRemoteAgents(function(err, ragents) {
      for (var i=0; i<ragents.length; i++) {
        ragentCreated(ragents[i])
      }
    })
  }

  //-----------------------------------
  function ragentCreated(ragent) {
    if (ragent.info.name != "ragent-console") return

    ragent.on("console", onConsole(ragent.info.id))
  }

  //-----------------------------------
  function onConsole(ragentID) {
    return function (event) {
      $scope.messages.push({
        rid: ragentID,
        cls: "message-" + event.type,
        txt: event.message
      })
      $scope.$apply()
    }
  }
}

//------------------------------------------------------------------------------
function connected($scope) {
  $scope.connectedLabel      = "connected"
  $scope.connectedLabelClass = "label label-success"

  try {
    $scope.$apply()
  }
  catch (e) {
  }
}

//------------------------------------------------------------------------------
function disconnected($scope) {
  $scope.connectedLabel      = "not connected"
  $scope.connectedLabelClass = "label label-danger"

  try {
    $scope.$apply()
  }
  catch (e) {
  }
}

//------------------------------------------------------------------------------
function getRagentsURL($scope) {
  if (!location.hash || location.hash == "") return prompt("enter a ragents session URL")

  return location.hash.substring(1)
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
