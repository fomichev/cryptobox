// =require extern/jquery/jquery.js
// =require extern/bootstrap/js/bootstrap.js
// =require extern/handlebars/handlebars.runtime.js

// =require extern/seedrandom/seedrandom.js
// =require extern/CryptoJS/components/core.js
// =require extern/CryptoJS/components/enc-base64.js
// =require extern/CryptoJS/components/cipher-core.js
// =require extern/CryptoJS/components/aes.js
// =require extern/CryptoJS/components/sha1.js
// =require extern/CryptoJS/components/hmac.js
// =require extern/CryptoJS/components/pbkdf2.js

// =require js/cryptobox.js
// =require js/cipher.js
// =require js/form.js
//= require js/lock.js
// =require js/ui.js
// =require js/password.js
// =require js/handlebars.js
// =require js/bootstrap.js
// =require chrome/templates.js

cryptobox.browser = {};

cryptobox.browser.sendTo = function(tab, message, callback) {
	chrome.tabs.sendMessage(tab.id, message, function(response) {
		callback(response);
	});
}

cryptobox.browser.sendToContentScript = function(message, callback) {
	chrome.tabs.getSelected(null, function(tab) {
		cryptobox.browser.sendTo(tab, message, callback);
	});
}

cryptobox.browser.copyToClipboard = function(text) {
	chrome.extension.getBackgroundPage().clipboardCopyNum++;
	chrome.extension.sendRequest({ text: text });
}

cryptobox.browser.cleanClipboard = function(text) {
	if (chrome.extension.getBackgroundPage().clipboardCopyNum != 0)
		cryptobox.browser.copyToClipboard('<%= @text[:cleared_clipboard] %>');
}

cryptobox.main = {};

cryptobox.main.show = function(div) {
	$("#div-locked").hide();
	$("#div-login-error").hide();
	$("#div-unlocked").hide();
	$("#div-details").hide();
	$("#div-generate").hide();

	if (div == '#div-unlocked' || div == '#div-details' || div == '#div-generate') {
		if (!$("#div-locked").is(":visible"))
			$("#div-navbar").fadeIn();
	} else {
		$("#div-navbar").hide();
	}

	$(div).fadeIn();
}

cryptobox.main.detailsClick = function(el) {
	var copy = function(value) {
		return '<a class="btn btn-mini btn-success button-copy" href="#" value="' + value + '"><%= @text[:button_copy] %></a>';
	}

	$('#div-details-body').html('');

	var values = {
		'<%= @text[:username] %>:': cryptobox.bootstrap.collapsible(el.form.vars.user, copy(el.form.vars.user)),
		'<%= @text[:password] %>:': cryptobox.bootstrap.collapsible(el.form.vars.pass, copy(el.form.vars.pass))
	};

	cryptobox.bootstrap.createDetails($('#div-details-body'), values);

	cryptobox.main.show('#div-details');
}

cryptobox.main.lock = function() {
	chrome.extension.getBackgroundPage().cfg = null;
	cryptobox.browser.cleanClipboard();
	cryptobox.bootstrap.render('locked', this);
	cryptobox.main.show('#div-locked');
	$("#input-password").focus();
}

cryptobox.main.unlock = function(pwd, unlockCallback) {
	if ("WebSocket" in window) {
		var timeout = setTimeout(function() {
			$('button').text('<%= @text[:server_not_responding] %>');
			$('button').addClass('btn-danger');
		}, 1000);

		var ws = new WebSocket("ws://127.0.0.1:22790");
		ws.onopen = function() { };
		ws.onmessage = function (evt) {
			clearTimeout(timeout);
			cryptobox.cfg = $.parseJSON(evt.data);
			var text = cryptobox.cipher.decrypt(pwd, cryptobox.cfg.pbkdf2.salt, cryptobox.cfg.ciphertext, cryptobox.cfg.pbkdf2.iterations, cryptobox.cfg.aes.keylen, cryptobox.cfg.aes.iv);
			unlockCallback($.parseJSON(text));
		};
		ws.onclose = function() { };
	} else {
		$('body').html('<h1><%= @text[:no_websocket_support] %></h1>');
	}
}

cryptobox.main.showData = function(data) {
	try {
		chrome.tabs.getSelected(null, function (t) {
			var matched = [];
			var unmatched = [];

			for (var i = 0; i < data.length; i++) {
				if (data[i].type == 'webform') {
					if (cryptobox.form.sitename(data[i].address) == cryptobox.form.sitename(t.url)) {
						matched.push(data[i]);
					} else {
						if (data[i].visible == true)
							unmatched.push(data[i]);
					}
				}
			}

			cryptobox.bootstrap.render('unlocked', { matched: matched, unmatched: unmatched });

			$("#div-login-error").hide();
			$("#div-login-details").hide();

			$('.button-login-matched').click(function() {
				var el = $.parseJSON($(this).parent().parent().attr('json'));
				cryptobox.browser.sendToContentScript({ type: 'fillForm', data: el }, function() {});
				window.close();
			});

			$('.button-login-unmatched').click(function() {
				var el = $.parseJSON($(this).parent().parent().attr('json'));
				chrome.tabs.create({ url: el.address, selected: true }, function(tab) {
					chrome.extension.getBackgroundPage().fill[tab.id] = el;
				});
			});

			$('.button-details').click(function() {
				var el = $.parseJSON($(this).parent().parent().attr('json'));
				cryptobox.main.detailsClick(el);
			});

			cryptobox.bootstrap.lockInit(function() {
				chrome.extension.getBackgroundPage().updateTimeout(); },
				chrome.extension.getBackgroundPage().cfg.lock_timeout_minutes,
				cryptobox.main.lock);
			cryptobox.bootstrap.filterInit();

			$('#button-hide-generate').click(function() {
				cryptobox.main.show('#div-unlocked');
			});

			$('#button-generate-show').click(function() {
				cryptobox.main.show('#div-generate');
			});

			$('#button-generate').click(function() {
				cryptobox.bootstrap.dialogGenerateSubmit();
			});

			$('#button-get-json').click(function() {
				cryptobox.browser.sendToContentScript({ type: 'getFormJson' }, function(text) {
					$('#div-details-body').html('<textarea class="span6" rows="20">' + text + '</textarea>');
					cryptobox.main.show('#div-details');
				});
			});

			$('#button-hide-details').click(function() {
				cryptobox.main.show('#div-unlocked');
			});

			cryptobox.main.show("#div-unlocked");
			$("#input-filter").focus();
		});
	} catch(e) {
		$("#div-login-error").show();
		alert(e);
		return;
	}
}

$(function() {
	chrome.extension.getBackgroundPage().clipboardCopyNum = 0;

	if (chrome.extension.getBackgroundPage().cfg != null) {
		chrome.extension.getBackgroundPage().updateTimeout();
		cryptobox.main.showData(chrome.extension.getBackgroundPage().cfg);
	} else {
		cryptobox.main.lock();

		$("#form-unlock").live('submit', function(event) {
			event.preventDefault();

			cryptobox.main.unlock($("#input-password").val(), function(cfg) {
				$("#input-password").val("");

				chrome.extension.getBackgroundPage().cfg = cfg;
				chrome.extension.getBackgroundPage().startTimeout();

				cryptobox.main.showData(cfg);
			});
		});
	}

	$('.button-copy').live('click', function() {
		cryptobox.browser.copyToClipboard($(this).attr('value'));
	});
});
