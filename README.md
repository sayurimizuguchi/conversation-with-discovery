# Conversation with Discovery

This is one simple example based on the Official repository from IBM Developers, [conversation-simple](https://github.com/watson-developer-cloud/conversation-simple).

## Basic useful feature list:

 * IBM Bluemix account.
 * Conversation and Discovery for uses Watson Services.
 * Node.js server installed.
 
 
## Before you begin

* Create a Bluemix account
    * [Sign up](https://console.ng.bluemix.net/registration/?target=/catalog/%3fcategory=watson) in Bluemix, or use an existing account. 
* Create a Watson Conversation Service
* Create a Watson Discovery Conversation Service
  

## Installing locally

If you want to modify the app or use it as a basis for building your own app, install it locally. 

Use GitHub to clone the repository locally, or [download the .zip file](https://github.com/sayurimizuguchi/conversation-with-discovery/archive/master.zip) of the repository and extract the files.


### After extract...

Open the command line in the extracted repository, and run: ```npm install --save``` for install all packages and execute the app.

Copy or rename the `.env.example` file to `.env` (nothing before the dot).

Replace the variables in the `.env` file with your **Service credentials** for Discovery and Conversation. Or the service that you want to use. For example:

Paste  the `password` and `username` values (without quotation marks) from the JSON into the `CONVERSATION_PASSWORD` and `CONVERSATION_USERNAME`:

    
    CONVERSATION_USERNAME=ca2905e6-7b5dxxxxx4408xxxxx3e604
    CONVERSATION_PASSWORD=87xxxxxpvU7l
    
**Obs.: You can see the Service Credentials accessing your Bluemix account and clicking  in your service, after it click in the: Service Credentials. Or, using the [Cloud Foundry](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) and using the command: `cf service-key my-conversation-service myKey` after logged.**

### After install the packages

After install, use the command line and run ```node server.js``` for execute the app. Access your app with the url: ```localhost:3000```



### Important to know

In your **Conversation Service**, access your **Workspace** and click in *Dialog*, for call the Discovery Service, replace the Node that you want to use to call the Discovery service and replace your JSON to: 


```javascript
{
  "output": {
    "text": {
      "values": [
        "Testing Discovery..."
      ],
      "selection_policy": "sequential"
    },
    "action": "callDiscovery"
  }
}
```
The ```"action": "callDiscovery"``` will be recognize with the code and will calling to Discovery service. You can see the code in the line [#90](https://github.com/sayurimizuguchi/conversation-with-discovery/blob/master/app.js#L90)


### Documentation for using Watson Discovery and Watson Conversation

 * [Official Documentation for use Conversation](https://console.bluemix.net/docs/services/conversation/index.html) for know more about Building with Watson Conversation
 * [Official API Reference for use Conversation](https://www.ibm.com/watson/developercloud/conversation/api/v1/?node#) for the awesome references in how to build Conversation with Node.js
* [Official Documentation for use Discovery with Node.js](https://console.bluemix.net/docs/services/discovery/index.html#about) for know more about Buildin awesome queries with Watson Discovery
 * [Official API Reference for use Discovery with Node.js](https://www.ibm.com/watson/developercloud/discovery/api/v1/?node) for the awesome references in how to build Queries using Discovery with Node.js
