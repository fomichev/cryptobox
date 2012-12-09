cryptobox.dropbox = {};
cryptobox.dropbox.client = null;
cryptobox.dropbox.callback = null;
cryptobox.dropbox.remember = true;

cryptobox.dropbox.getCredentials = function() {
	console.log('getCredentials');

	var data = localStorage.getItem(cryptobox.dropbox.storageKey);

	try {
		return JSON.parse(data);
	} catch (e) {
		return null;
	}
}

cryptobox.dropbox.setCredentials = function(data) {
	console.log('setCredentials');
	console.log(data);

	localStorage.setItem(cryptobox.dropbox.storageKey, JSON.stringify(data));
}

cryptobox.dropbox.clearCredentials = function() {
	console.log('clearCredentials');

	localStorage.removeItem(cryptobox.dropbox.storageKey);
}

cryptobox.dropbox.read = function(callback) {
	var timeout = 100;

	console.log('read');

	if (cryptobox.dropbox.ready == false) {
		if (timeout-- && cryptobox.dropbox.client)
			setTimeout(function() { cryptobox.dropbox.read(callback); }, 100);
		else
			callback('Dropbox authentication error', null);
		return;
	}

	cryptobox.dropbox.client.readFile('cryptobox.json', callback);
}

cryptobox.dropbox.prepare = function(token_callback, auth_callback) {
	if (Cryptobox.json == null) {
		cryptobox.dropbox.client = new Dropbox.Client({
			key: "nEGVEjZUFiA=|o5O6VucOhZA5Fw39MGotRofoEXUIO0MjFU6dmDpYNA==", sandbox: true
		});

		cryptobox.dropbox.client.authDriver({
			url: function() { return ""; },
			doAuthorize: function(authUrl, token, tokenSecret, done) {

				console.log('doAuthorize');
				console.log(cryptobox.dropbox.getCredentials());

				console.log('use new');

				token_callback(authUrl);
				cryptobox.dropbox.callback = function() { done(); }
			},
			onAuthStateChange: function(client, done) {
				var ERROR = 0;
				var RESET = 1;
				var REQUEST = 2;
				var AUTHORIZED = 3;
				var DONE = 4;
				var SIGNED_OFF = 5;

				console.log('STATE=' + client.authState);

				cryptobox.dropbox.storageKey = cryptobox.dropbox.client.appHash() + ':cryptobox.json';
				cryptobox.dropbox.ready = false;

				if (client.authState == RESET) {
					console.log('-> RESET');

					var credentials = cryptobox.dropbox.getCredentials();
					console.log("credentials");
					console.log(credentials);
					if (!credentials)
						return done();

					client.setCredentials(credentials);

					return done();
				} else if (client.authState == REQUEST) {
					console.log('-> REQUEST');

					var credentials = client.credentials();
					credentials.authState = AUTHORIZED;

					cryptobox.dropbox.setCredentials(credentials);
					done();
				} else if (client.authState == DONE) {
					console.log('-> DONE');

					client.getUserInfo(function(error) {
						if (error) {
							client.reset();
							cryptobox.dropbox.clearCredentials();
						}

						console.log("GOT USER INFO");

						if (cryptobox.dropbox.remember) {
							var credentials = cryptobox.dropbox.getCredentials();
							credentials.authState = DONE;

							cryptobox.dropbox.setCredentials(credentials);
						} else {
							console.log('CLEAR');
							cryptobox.dropbox.clearCredentials();
						}
						cryptobox.dropbox.ready = true;

						return done();
					});
				} else if (client.authState == SIGNED_OFF) {
					console.log('-> SIGNED_OFF');
					cryptobox.dropbox.clearCredentials();
					done();
				} else if (client.authState == ERROR) {
					console.log('-> ERROR');
					cryptobox.dropbox.clearCredentials();
					cryptobox.dropbox.client = null;
					done();
				} else if (client.authState == AUTHORIZED) {
					return done();
				} else {
					console.log('-> ?');
					return done();
				}
			}
		});

		cryptobox.dropbox.client.authenticate(function(error, client) {
			auth_callback(error);
		});
	}
}

cryptobox.dropbox.authenticate = function(remember) {
	console.log('{{{');

	if (Cryptobox.json == null) {
		console.log('remember');
		console.log(remember);

		cryptobox.dropbox.remember = remember;
		if (!cryptobox.dropbox.remember) {
			console.log('FORGEEET');
			cryptobox.dropbox.clearCredentials();
		}

		if (cryptobox.dropbox.callback == null) {
			console.log('callback is null');
			/* use save credentials */
			return;
		}

		cryptobox.dropbox.callback();
	}

	console.log('}}}');
}
