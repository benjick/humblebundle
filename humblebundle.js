var request = Npm.require('request').defaults({
	jar: true,
	headers: {
		'Accept': 'application/json', 
		'Accept-Charset': 'utf-8', 
		'Keep-Alive': 'true',
		'X-Requested-By': 'hb_android_app', 
		'User-Agent': 'Apache-HttpClient/UNAVAILABLE (java 1.4)'
	}
});
// using request instead of Meteor.HTTP since it doesn't support cookies
var fs = Npm.require('fs');

var loginUrl = 'https://www.humblebundle.com/processlogin';
var orderListUrl = 'https://www.humblebundle.com/api/v1/user/order';
var orderUrl = 'https://www.humblebundle.com/api/v1/order/'; // + gamekey
var service = 'humblebundle';

var post = Meteor.wrapAsync(request.post, request); // make it synchronous-like
var get  = Meteor.wrapAsync(request.get, request);

self = {};

self.getOrders = function(username,password) {
	var credentials = {
		username: username,
		password: password
	};
	
	if(self.login(credentials)) {
		var gamekeys = self.getKeys();
		self.getGames(gamekeys);
	}
}

self.login = function(credentials) {
	var postResult = post({
		uri: loginUrl,
		body: Npm.require('querystring').stringify(credentials),
	});

	if(JSON.parse(postResult.body).success === true) {
		return true;
	}
	return false;
}

self.getKeys = function() {
	var getResult = get({
		url: orderListUrl
	});
	return JSON.parse(getResult.body);
}

self.getGames = function(keys) {
	keys.forEach(function (post) {
		var games = get({
			url: orderUrl + post.gamekey
		})
		var games = JSON.parse(games.body).subproducts;
		games.forEach(function (game) {
			Games.upsert(
				service + ':' + game.machine_name,
				{$set: {
					userId: Meteor.userId(),
					name: game.human_name,
					image: game.icon,
					service: service
				}}
			);
		});
	});
}

humbleApi = self;