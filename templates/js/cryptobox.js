var cryptobox = {};

cryptobox.json = null;

cryptobox.measure = function(name, fn) {
	var begin = Date.now(), end;
	var result = fn();
	end = Date.now();
	console.log(name + ' ' + (end - begin) + 'ms');
	return result;
}

cryptobox.open = function(pwd, callback) {
	var decrypt = function(json, callback) {
		/* we need small timeout here because otherwise decryption
		 * stuff will not let the UI to be redrawn */
		setTimeout(function() {
			try {
				var data = cryptobox.measure('decrypt', function(){
					var text = cryptobox.cipher.decrypt(pwd,
						json.pbkdf2.salt,
						json.ciphertext,
						json.pbkdf2.iterations,
						json.aes.keylen,
						json.aes.iv);
					return $.parseJSON(text);
				});

				callback(data, null);
			} catch (e) {
				callback(null, "<%= @text[:incorrect_password] %> " + e);
			}
		}, 10);
	}

	if (cryptobox.json) {
		decrypt(cryptobox.json, callback);
	} else {
		var hostname = "wss://127.0.0.1:22790";

		if ("WebSocket" in window) {
			var timeout = setTimeout(function() {
				callback(null, '<%= @text[:server_not_responding] %>');
			}, 5000);

			var ws = new WebSocket(hostname);
			ws.onopen = function() { };
			ws.onmessage = function (evt) {
				clearTimeout(timeout);
				decrypt($.parseJSON(evt.data), callback);
			};
			ws.onclose = function() {
				/* TODO: tell user to check sertificate
				 * when close was not clean */
			};
		} else {
			callback(null, '<%= @text[:no_websocket_support] %>');
		}
	}
}
