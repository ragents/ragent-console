# Licensed under the Apache License. See footer for details.

require "cakex"

child_process = require "child_process"

pkg = require "./package.json"

#-------------------------------------------------------------------------------
task "watch", "watch for source file changes, build", -> taskWatch()
task "build", "run build",                            -> taskBuild()

WatchSpec = "index.js"

#-------------------------------------------------------------------------------
mkdir "-p", "tmp"

#-------------------------------------------------------------------------------
taskBuild = ->
  cp "-f", "node_modules/ragents/www/ragents-browser.js",          "www/scripts"
  cp "-f", "node_modules/ragents/www/ragents-browser.js.map.json", "www/scripts"

  browserifyOpts = [
    "index.js"
    "--outfile tmp/ragent-console.js"
    "--standalone ragentConsole"
    "--debug"
  ]

  browserify browserifyOpts.join " "

  cat_source_map "tmp/ragent-console.js ragent-console.js"

#-------------------------------------------------------------------------------
watchIter = ->
  taskBuild()

#-------------------------------------------------------------------------------
taskWatch = ->
  watchIter()

  watch
    files: WatchSpec.split " "
    run:   watchIter

  # watch
  #   files: "doc/**/*"
  #   run:   watchIterDoc

  watch
    files: "Cakefile"
    run: (file) ->
      return unless file == "Cakefile"
      log "Cakefile changed, exiting"
      exit 0

#-------------------------------------------------------------------------------
cleanDir = (dir) ->
  mkdir "-p", dir
  rm "-rf", "#{dir}/*"

#-------------------------------------------------------------------------------
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#-------------------------------------------------------------------------------
