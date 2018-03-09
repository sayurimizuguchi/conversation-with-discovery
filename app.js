'use strict';

require('dotenv').config({ silent: true });

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests

//setup watson services
var ConversationV1 = require('watson-developer-cloud/conversation/v1'); // watson sdk
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

//discovery config
var discovery = new DiscoveryV1({
  username: process.env.DISCOVERY_USERNAME,
  password: process.env.DISCOVERY_PASSWORD,
  version_date: '2017-05-26'
});

//discovery params for methods
var params = {
    'query': "query string",
    //natural_language_query: '', if you want to use natural language query, set params.natural_language_query with the input from the user!
    environment_id: process.env.DISCOVERY_ENVIRONMENT_ID, //these 29-31 values are inside the .env file
    collection_id: process.env.DISCOVERY_COLLECTION_ID,
    configuration_id: process.env.DISCOVERY_CONFIGURATION_ID,
    passages: true, //if you want to disable, set to false
    return: 'text, title'
  //  highlight: true // if you want to enable, uncomment
}

// conversation config
var conversation = new ConversationV1({
    url: 'https://gateway.watsonplatform.net/conversation/api',
    username: process.env.CONVERSATION_USERNAME || 'replace with the username',
    password: process.env.CONVERSATION_PASSWORD || 'replace with the password',
    version_date: '2018-02-16', //set currenct date, check here https://www.ibm.com/watson/developercloud/conversation/api/v1/#versioning
    version: 'v1'
});

// Endpoint to be call from the client side for message
app.post('/api/message', (req, res) => {
    var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
    if (!workspace || workspace === '<workspace-id>') {
        return res.json({
            'output': {
                'text': 'Please update the WORKSPACE_ID in your .env file with your credential! If you did update, try to verify if the file are just with the name: .env'
            }
        });
    }
    var payload = {
        workspace_id: workspace,
        context: {},
        input: {}
    };
    if (req.body) {
        if (req.body.input) {
            payload.input = req.body.input;
        }
        if (req.body.context) {
            // The client must maintain context/state
            payload.context = req.body.context;
        }
    }
    // Send the input to the conversation service
    conversation.message(payload, function(err, data) {
        if (err) {
            return res.status(err.code || 500).json(err);
        }
        updateMessage(res, payload, data);
    });
});

/*
 * Updates the response text using the intent confidence
 * @param  {Object} res The node.js http response object
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */
function updateMessage(res, input, response) {
    if (!response.output) {
        response.output = {};
    } else if (response.output.action === 'callDiscovery') {
      /* if you want to use natural_language_query, set here the input from the user like my example: 
      params.natural_language_query = response.input.text || null;
      */
        console.log('Calling discovery.. ');
        discovery.query(params, (error, returnDiscovery) => {
            if (error) {
              next(error);
            } else {
              console.log('return from discovery: '+returnDiscovery);
              //if you want to send all text returned from discovery, discomment these lines
              /*  var text;
                  for (i = 0; i < returnDiscovery.results.length; i++) {
                    text += returnDiscovery.results[i].text + "<br>";
                  }
              //sending the TEXT returned from discovery results
              response.output.text = 'Discovery call with success, check the results: <br>' + text; //results */
              //sending the PASSAGES returned from discovery results
              response.output.text = 'Discovery call with success, check the results: <br>' + returnDiscovery.passages[0].passage_text; //passageResults
              return res.json(response);
            };
        });
    } else if (response.output && response.output.text) {
        return res.json(response);
    }
}

module.exports = app;
