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
					var text = Cryptobox.decrypt(pwd,
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
		cryptobox.dropbox.read(function(error, data) {
			if (error) {
				console.log('error:');
				console.log(error);
				callback(null, "Can't read file 'cryptobox.json (" + error + ")'");
				return;
			}

			decrypt($.parseJSON(data), callback);
		});
	}
}
