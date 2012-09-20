cryptobox.browser = {};

cryptobox.browser.sendToContentScript = function(message, callback) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, message, function(response) {
			callback(response);
		});
	});
}

cryptobox.browser.copy = function(text) {
	chrome.extension.sendRequest({ text: text });
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

cryptobox.main.matchedHeaderClick = function(el) {
	cryptobox.browser.sendToContentScript({ type: 'fillForm', data: el }, function() {});
	window.close();
}

cryptobox.main.copyToClipboard = function(value) {
	return '<a class="btn btn-mini btn-success button-copy" href="#" value="' + value + '"><%= @text[:button_copy] %></a>';
}

cryptobox.main.detailsClick = function(el) {
	$('#div-details-body').html('');

	var values = {
		'<%= @text[:username] %>:': cryptobox.bootstrap.collapsible(el.form.vars.user, cryptobox.main.copyToClipboard(el.form.vars.user)),
		'<%= @text[:password] %>:': cryptobox.bootstrap.collapsible(el.form.vars.pass, cryptobox.main.copyToClipboard(el.form.vars.pass))
	};

	cryptobox.bootstrap.createDetails($('#div-details-body'), values);

	cryptobox.main.show('#div-details');
}

cryptobox.main.lock = function() {
	chrome.extension.getBackgroundPage().data = null;
	cryptobox.browser.copy('<%= @text[:cleared_clipboard] %>');
	cryptobox.bootstrap.render('locked', this);
	cryptobox.main.show('#div-locked');
	$("#input-password").focus();
}

cryptobox.main.unlock = function(pwd) {
	<% if @config[:chrome][:embed] %>
	var text = cryptobox.cipher.decrypt(pwd, cryptobox.cfg.pbkdf2.salt, cryptobox.cfg.ciphertext, cryptobox.cfg.pbkdf2.iterations, cryptobox.cfg.aes.iv);
	return $.parseJSON(text);
	<% else %>
	// TODO
	return [];
	<% end %>
}

cryptobox.main.showData = function(data) {
	try {
		chrome.tabs.getSelected(null, function (t) {
			var matched = [];
			var unmatched = [];

			for (var i = 0; i < data.length; i++) {
				if (data[i].type == 'login') {
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
				cryptobox.main.matchedHeaderClick(el);
			});

			$('.button-details').click(function() {
				var el = $.parseJSON($(this).parent().parent().attr('json'));
				cryptobox.main.detailsClick(el);
			});


			cryptobox.bootstrap.lockInit(function() { chrome.extension.getBackgroundPage().updateTimeout(); }, cryptobox.main.lock);
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

$(document).ready(function() {
	if (chrome.extension.getBackgroundPage().data != null) {
		chrome.extension.getBackgroundPage().updateTimeout();
		cryptobox.main.showData(chrome.extension.getBackgroundPage().data);
	} else {
		cryptobox.main.lock();

		$("#form-unlock").live('submit', function(event) {
			event.preventDefault();

			var data = cryptobox.main.unlock($("#input-password").val());
			$("#input-password").val("");

			chrome.extension.getBackgroundPage().startTimeout();
			chrome.extension.getBackgroundPage().data = data;

			cryptobox.main.showData(data);
		});
	}

	$('.button-copy').live('click', function() {
		cryptobox.browser.copy($(this).attr('value'));
	});

	$('.collaplible').live('click', function() {
		event.preventDefault();

		$(this).parent().next().toggle();
	});
});
