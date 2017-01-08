// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// There should be a better way to do this...
process.env.TZ = 'America/Los_Angeles';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

// [START YourAction]
app.post('/', function (req, res) {
  const assistant = new Assistant({request: req, response: res});
  console.log('Request headers: ' + JSON.stringify(req.headers));
  console.log('Request body: ' + JSON.stringify(req.body));

  // Fulfill action business logic
  function responseHandler (assistant) {
    // Complete your fulfillment logic and send a response
    let response = '';
    if (assistant.getIntent() != "play_quietly") {
      response = 'Are you wondering if it is time to play quietly? ';
    }
    let date = new Date();
    let current_hour = date.getHours();
    let dateString;
    if (current_hour == 0) {
      dateString = 'midnight'
    } else if (current_hour <= 12) {
      dateString = current_hour + 'am';
    } else {
      dateString = (current_hour - 12) + 'pm';
    }
    response += 'It\'s ' + dateString + '. ';
    if (current_hour < 6 || current_hour > 20) {
      response += 'It is the middle of the night. Go back to sleep.';
    } else if (current_hour < 7) {
      response += 'Yes, you can play quietly.';
    } else {
      response += 'Actually it is wake-up time now.';
    }
    assistant.tell(response);
  }

  assistant.handleRequest(responseHandler);
});
// [END YourAction]

if (module === require.main) {
  // [START server]
  // Start the server
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
  // [END server]
}

module.exports = app;
