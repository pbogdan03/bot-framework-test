'use strict';

var restify = require('restify');
var BotBuilder = require('botbuilder');
try {
	var env = require('dotenv').config();
} catch(err) {
	
}

var model = 'https://api.projectoxford.ai/luis/v1/application?id=c413b2ef-382c-45bd-8ff0-f76d60e2a821&subscription-key=0a23f3010b154720875c6e213e1eebbd&q=';
var dialog = new BotBuilder.LuisDialog(model);

// Create a text bot that takes your name and responds using that name
var txtBot = new BotBuilder.TextBot();//new BotBuilder.BotConnectorBot();
txtBot.add('/', new BotBuilder.CommandDialog()
	.matches('^set name', BotBuilder.DialogAction.beginDialog('/profile'))
	.matches('^luis', '/luis')
	.matches('^quit', BotBuilder.DialogAction.endDialog())
	.onDefault(function(session) {
	if(!session.userData.name) {
		session.beginDialog('/profile');
	} else {
		session.send("I hear you %s, now tell me what'ya want!", session.userData.name);
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
		session.send('Hello dear %s!', session.userData.name);
		session.endDialog();
	}
]);
txtBot.add('/luis', dialog
	.on('builtin.intent.alarm.set_alarm', '/set-alarm')
	.on('builtin.intent.alarm.delete_alarm', '/delete-alarm')
	.onDefault(BotBuilder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."))
);
txtBot.add('/set-alarm', function(session) {
	session.send('Creating Alarm');
	session.endDialog();
});
txtBot.add('/delete-alarm', function(session) {
	session.send('Deleting Alarm');
	session.endDialog();
});

txtBot.listenStdin();

// // Setup Restify Server
// var server = restify.createServer();
// server.use(txtBot.verifyBotFramework({
// 	appId: process.env.APPID,
// 	appSecret: process.env.APPSECRET
// }));
// server.post('/api/messages', txtBot.listen());
// server.listen(process.env.PORT || 8080, function() {
// 	console.log('server listening to %s', process.env.PORT || 8080);
// });