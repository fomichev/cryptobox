cryptobox.browser = {};

cryptobox.browser.sendToBackground = function(r) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, r, function(msg) {
			console.log("sent msg");
		});
	});
}

cryptobox.app = {};

cryptobox.app.show = function(div) {
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

cryptobox.app.matchedHeaderClick = function(el) {
	cryptobox.browser.sendToBackground(el);
	window.close();
}

cryptobox.app.detailsClick = function(el) {
	$('#div-details-body').html('');

	var values = {
		'<%= @text[:username] %>:': el.form.vars.user,
		'<%= @text[:password] %>:': el.form.vars.pass
	};

	cryptobox.bootstrap.createDetails($('#div-details-body'), values);

	cryptobox.app.show('#div-details');
}

cryptobox.app.lock = function() {
	chrome.extension.getBackgroundPage().data = null;
	cryptobox.app.render('locked', this);
	cryptobox.app.show('#div-locked');
	$("#input-password").focus();
}

cryptobox.app.unlock = function(pwd) {
	<% if @config[:chrome][:embed] %>
	var text = cryptobox.cipher.decrypt(pwd, cryptobox.cfg.pbkdf2.salt, cryptobox.cfg.ciphertext, cryptobox.cfg.pbkdf2.iterations, cryptobox.cfg.aes.iv);
	return jQuery.parseJSON(text);
	<% else %>
	// TODO
	return [];
	<% end %>
}

cryptobox.app.showData = function(data) {
	try {
		chrome.tabs.getSelected(null, function (t) {
			var matched = [];
			var unmatched = [];

			for (var i = 0; i < data.length; i++) {
				if (data[i].type == 'login') {
					if (cryptobox.form.sitename(data[i].address) == cryptobox.form.sitename(t.url))
						matched.push(data[i]);
					else
						unmatched.push(data[i]);
				}
			}

			cryptobox.app.render('unlocked', { matched: matched, unmatched: unmatched });

			$("#div-login-error").hide();
			$("#div-login-details").hide();

			$('.button-login-matched').click(function() {
				var el = $.parseJSON($(this).parent().parent().attr('json'));
				cryptobox.app.matchedHeaderClick(el);
			});

			$('.button-details').click(function() {
				var el = $.parseJSON($(this).parent().parent().attr('json'));
				cryptobox.app.detailsClick(el);
			});


			cryptobox.bootstrap.lockInit(function() { chrome.extension.getBackgroundPage().updateTimeout(); });
			cryptobox.bootstrap.filterInit();

			$('#button-hide-generate').click(function() {
				cryptobox.app.show('#div-unlocked');
			});

			$('#button-generate-show').click(function() {
				cryptobox.app.show('#div-generate');
			});

			$('#button-generate').click(function() {
				cryptobox.bootstrap.dialogGenerateSubmit();
			});


			$('#button-hide-details').click(function() {
				cryptobox.app.show('#div-unlocked');
			});

			cryptobox.app.show("#div-unlocked");
			$("#input-filter").focus();
		});
	} catch(e) {
		$("#div-login-error").show();
		alert(e);
		return;
	}
}

cryptobox.app.render = function(name, context) {
	var text = Handlebars.templates[name](context);
	$('#content').html(text);
}

$(document).ready(function() {
	if (chrome.extension.getBackgroundPage().data != null) {
		chrome.extension.getBackgroundPage().updateTimeout();
		cryptobox.app.showData(chrome.extension.getBackgroundPage().data);
	} else {
		cryptobox.app.lock();

		$("#form-unlock").submit(function(event) {
			event.preventDefault();

			var data = cryptobox.app.unlock($("#input-password").val());
			$("#input-password").val("");

			chrome.extension.getBackgroundPage().startTimeout();
			chrome.extension.getBackgroundPage().data = data;

			cryptobox.app.showData(data);
		});
	}
});
