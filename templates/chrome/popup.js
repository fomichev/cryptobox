//= require extern/jquery/jquery.js
//= require extern/bootstrap/js/bootstrap.js
//= require extern/handlebars/handlebars.runtime.js

//= require extern/seedrandom/seedrandom.js
//= require extern/CryptoJS/components/core.js
//= require extern/CryptoJS/components/enc-base64.js
//= require extern/CryptoJS/components/cipher-core.js
//= require extern/CryptoJS/components/aes.js
//= require extern/CryptoJS/components/sha1.js
//= require extern/CryptoJS/components/hmac.js
//= require extern/CryptoJS/components/pbkdf2.js

//= require cryptobox.js.coffee
//= require lock.js.coffee
//= require form.js.coffee
//= require js/dropbox.js
//= require ui.js.coffee
//= require password.js.coffee
//= require handlebars.js.coffee
//= require js/bootstrap.js
//= require chrome/templates.js

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
	chrome.extension.getBackgroundPage().json = null;
	cryptobox.browser.cleanClipboard();
	cryptobox.bootstrap.render('locked', this);
	cryptobox.main.show('#div-locked');
	cryptobox.main.prepare();
	$("#input-password").focus();
}

cryptobox.main.prepare = function() {
	cryptobox.dropbox.prepare(
		function(url) {
			cryptobox.bootstrap.showAlert(false, 'Dropbox authentication required: <p><a href="' + url + '" target="_blank">' + url + '</a></p>');
		},
		function(error) {
			if (error) {
				cryptobox.bootstrap.showAlert(true, 'Dropbox authentication error');
			} else {
				cryptobox.bootstrap.showAlert(false, 'Successfully restored Dropbox credentials');
			}
		});
}

cryptobox.main.showData = function(data) {
	chrome.tabs.getSelected(null, function (t) {
		var matched = [];
		var unmatched = [];

		for (var i = 0; i < data.length; i++) {
			if (data[i].type == 'webform') {
				if (Cryptobox.form.sitename(data[i].address) == Cryptobox.form.sitename(t.url)) {
					matched.push(data[i]);
				} else {
					if (data[i].visible == true)
						unmatched.push(data[i]);
				}
			}
		}

		cryptobox.bootstrap.render('unlocked', { matched: matched, unmatched: unmatched });

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

		cryptobox.bootstrap.lockInit(
			function() { chrome.extension.getBackgroundPage().lock.rewind(); cryptobox.lock.rewind(); },
			cryptobox.config.lock_timeout_minutes,
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
}

$(function() {
	chrome.extension.getBackgroundPage().clipboardCopyNum = 0;

	if (chrome.extension.getBackgroundPage().json != null) {
		chrome.extension.getBackgroundPage().lock.rewind();
		cryptobox.main.showData(chrome.extension.getBackgroundPage().json);
	} else {
		cryptobox.main.lock();

		$("#form-unlock").live('submit', function(event) {
			event.preventDefault();

			cryptobox.dropbox.authenticate($("#input-remember").is(':checked'));

			$('#button-unlock').button('loading');
			cryptobox.bootstrap.hideAlert();

			Cryptobox.open($("#input-password").val(), function(json, error) {
				if (error) {
					$("#button-unlock").button("reset");
					cryptobox.bootstrap.showAlert(true, error);
				} else {
					$("#input-password").val("");

					chrome.extension.getBackgroundPage().json = json;

					chrome.extension.getBackgroundPage().lock = new Cryptobox.Lock(
						function() { chrome.extension.getBackgroundPage().lock.rewind(); },
						cryptobox.config.lock_timeout_minutes,
						function() { chrome.extension.getBackgroundPage().json = null; }
						);

					chrome.extension.getBackgroundPage().lock.start();

					cryptobox.main.showData(json);
				}
			});
		});
	}

	$('.button-copy').live('click', function() {
		cryptobox.browser.copyToClipboard($(this).attr('value'));
	});
});
