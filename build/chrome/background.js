(function() {
  var Cryptobox;

  Cryptobox = {};

  window.Cryptobox = Cryptobox;

  window.cryptobox = {};

  Cryptobox.json = null;

  window.p = function(s) {
    return typeof console !== "undefined" && console !== null ? console.log(s) : void 0;
  };

  window.dbg = function(s) {};

  Cryptobox.measure = function(name, fn) {
    var begin, end, result;
    begin = Date.now();
    result = fn();
    end = Date.now();
    p("" + name + " " + (end - begin) + "ms");
    return result;
  };

  Cryptobox.decrypt = function(pass, salt, ciphertext, iterations, keylen, iv) {
    var result, secret;
    secret = CryptoJS.PBKDF2(pass, CryptoJS.enc.Base64.parse(salt), {
      keySize: keylen / 32,
      iterations: iterations
    });
    result = CryptoJS.AES.decrypt(ciphertext, secret, {
      mode: CryptoJS.mode.CBC,
      iv: CryptoJS.enc.Base64.parse(iv),
      padding: CryptoJS.pad.Pkcs7
    });
    return result.toString(CryptoJS.enc.Utf8);
  };

  Cryptobox.open = function(password, callback) {
    var decrypt;
    decrypt = function(json, callback) {
      return setTimeout(function() {
        var data;
        try {
          data = Cryptobox.measure('decrypt', function() {
            return JSON.parse(Cryptobox.decrypt(password, json.pbkdf2.salt, json.ciphertext, json.pbkdf2.iterations, json.aes.keylen, json.aes.iv));
          });
          return callback(data, null);
        } catch (e) {
          return callback(null, "<%= @text[:incorrect_password] %> " + e);
        }
      }, 10);
    };
    if (Cryptobox.json) {
      return decrypt(Cryptobox.json, callback);
    } else {
      return cryptobox.dropbox.read(function(error, data) {
        if (error) {
          callback(null, "Can't read file 'cryptobox.json (" + error + ")'");
          return;
        }
        return decrypt($.parseJSON(data), callback);
      });
    }
  };

}).call(this);

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
