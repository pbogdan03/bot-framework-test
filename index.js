'use strict';

var restify = require('restify');
var BotBuilder = require('botbuilder');

// Create bot and add dialogs
var bot = new BotBuilder.BotConnectorBot({
	appId: 'YourAppId',
	appSecret: 'YourAppSecret'
});

bot.add('/', function(session) {
	session.send('Hello World');
});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function() {
	console.log('%s listening to %s', server.name, server.url);
});