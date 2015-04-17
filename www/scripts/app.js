// Licensed under the Apache License. See footer for details.

var app = angular.module("app", [])

app.controller("BodyController", BodyController)

ConsoleAgents = []

//------------------------------------------------------------------------------
function BodyController($scope) {
  disconnected($scope, false)
  restoreFromLocalStorage($scope)

  $scope.connect = connect

  //-----------------------------------
  function connect() {
    saveToLocalStorage($scope)

    var config = {
      url: $scope.serverUrl,
      key: $scope.sessionKey
    }

    ragents.createSession(config, sessionCreated)
  }

  //-----------------------------------
  function sessionCreated(err, session) {
    if (err) return alert("error creating session: " + err)

    RagentsSession = session

    session.on("close", function() {
      RagentsSession = null
    })

    session.on("close", function() {
      RagentsSession = null
    })

    session.on("ragentCreated", function(ragent) {
      if (ragent.name != "ragent-console") return
    })

    session.getRemoteAgents(function(err, ragents) {
      for (var i=0; i<ragents.length; i++) {
        if (ragent.name != "ragent-console") continue

        ragent.on()
      }
    })

  }

  //-----------------------------------
  function attached(err) {
    if (err) {
      alert("error attaching to ragents server: " + err)
      return
    }

    connected($scope, true)
  }

}

function addConsoleRAgent(ragent) {
  for (var i=0; i<ConsoleAgents.length; i++) {
    if (ragent.info.id == ConsoleAgents[i].info.id) return
  }

  ConsoleAgents.push(ragent)
}

function delConsoleRAgent(ragent) {
  ConsoleAgents
}

//------------------------------------------------------------------------------
function connected($scope, apply) {
  $scope.connectedLabel      = "connected"
  $scope.connectedLabelClass = "label label-success"

  if (!apply) return
  $scope.$apply()
}

//------------------------------------------------------------------------------
function disconnected($scope, apply) {
  $scope.connectedLabel      = "not connected"
  $scope.connectedLabelClass = "label label-danger"

  if (!apply) return
  $scope.$apply()
}

//------------------------------------------------------------------------------
function restoreFromLocalStorage($scope) {
  $scope.serverUrl  = window.localStorage.serverUrl  || ""
  $scope.sessionKey = window.localStorage.sessionKey || ""
}

//------------------------------------------------------------------------------
function saveToLocalStorage($scope) {
  if (!$scope.serverUrl) return
  if (!$scope.sessionKey) return

  window.localStorage.serverUrl  = $scope.serverUrl
  window.localStorage.sessionKey = $scope.sessionKey
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
