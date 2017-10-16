'use strict';

require('dotenv').config({ silent: true });

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var watson = require('watson-developer-cloud'); // watson sdk

//setup discovery
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

//discovery service credentials
var discovery = new DiscoveryV1({
  username: process.env.DISCOVERY_USERNAME,
  password: process.env.DISCOVERY_PASSWORD,
  version_date: '2017-05-26'
});

//discovery params
var params = {
    'query': "Sayuri",
    //these values are inside the .env file
    'environment_id': process.env.DISCOVERY_ENVIRONMENT_ID,
    'collection_id': process.env.DISCOVERY_COLLECTION_ID,
    'configuration_id': process.env.DISCOVERY_CONFIGURATION_ID,
    'passages': true, //if you want to disable, set to false
    return: 'text, title'
  //  highlight: true // if you want to enable, uncomment
}

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// Create the service wrapper
var conversation = watson.conversation({
    url: 'https://gateway.watsonplatform.net/conversation/api',
    username: process.env.CONVERSATION_USERNAME || 'replace with the username',
    password: process.env.CONVERSATION_PASSWORD || 'replace with the password',
    version_date: '2016-07-11',
    version: 'v1'
});

// Endpoint to be call from the client side
app.post('/api/message', function(req, res) {
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

/**
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
        console.log('Calling discovery.. ');

        discovery.query(params, (error, results) => {
            if (error) {
              next(error);
            } else {
              console.log(results);              
              //sending the result for the user...
              response.output.text = 'Discovery call with success, check the results: <br>' + results.passages[0].passage_text;
              return res.json(response);
            };
        });

    } else if (response.output && response.output.text) {
        return res.json(response);
    }
}

module.exports = app;