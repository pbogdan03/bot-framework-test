'use strict';

var restify = require('restify');
var BotBuilder = require('botbuilder');
var env = require('dotenv').config();

// Create a text bot that takes your name and responds using that name
var txtBot = new BotBuilder.BotConnectorBot();
txtBot.add('/', new BotBuilder.CommandDialog()
	.matches('^set name', BotBuilder.DialogAction.beginDialog('/profile'))
	.matches('^quit', BotBuilder.DialogAction.endDialog())
	.onDefault(function(session) {
	if(!session.userData.name) {
		session.beginDialog('/profile');
	} else {
		session.send('Hello %s!', session.userData.name);
	}
}));
txtBot.add('/profile', [
	function(session) {
		if(session.userData.name) {
			BotBuilder.Prompts.text(session, 'What would you like to change it to?');
		} else {
			BotBuilder.Prompts.text(session, 'Hi! What is your name?');
		}
	},
	function(session, results) {
		session.userData.name = results.response;
		session.endDialog();
	}
]);

// Setup Restify Server
var server = restify.createServer();
server.use(txtBot.verifyBotFramework({
	appId: process.env.APPID,
	appSecret: process.env.APPSECRET
}));
server.post('/api/messages', txtBot.listen());
server.listen(process.env.port || 8080, function() {
	console.log('%s listening to %s', server.name, server.url);
});