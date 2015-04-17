ragent-console - ragent to handle console messsages
================================================================================

For more info on ragents, see: <https://www.npmjs.com/package/ragents>


sample
================================================================================

    var rConsole = require("ragent-console")
    rConsole.attach(function(err) {
      if (!err) {
        console.log("error attaching to ragents server:" + err)
        return
      }

      rConsole.install()
    })

    ...

    console.log("hi, world") // writes to console and emits ragents event




hacking
================================================================================

This project uses [cake](http://coffeescript.org/#cake) as it's
build tool.  To rebuild the project continuously, use the command

    npm run watch

Other `cake` commands are available (assuming you are using npm v2) with
the command

    npm run cake -- <command here>

Run `npm run cake` to see the other commands available in the `Cakefile`.



license
================================================================================

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
