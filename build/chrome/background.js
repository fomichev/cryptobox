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
;

var fill = {};

/* Clipboard copy handler */
chrome.extension.onRequest.addListener(function (msg, sender, sendResponse) {
	var body = document.getElementsByTagName('body') [0];
	var ta = document.createElement('textarea');

	body.appendChild(ta);
	ta.value = msg.text;
	ta.select();
	document.execCommand("copy", false, null);
	body.removeChild(ta);

	sendResponse({});
});

/* Unmatched form fill handler */
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
	if (info.status == 'complete' && tabId in fill) {
		var msg = { type: 'fillForm', cfg: fill[tabId] };
		chrome.tabs.sendMessage(tabId, msg, function() { });
		delete fill[tabId];
	}
});
