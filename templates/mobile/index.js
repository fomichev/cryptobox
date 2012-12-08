//= require cryptobox.js.coffee
//= require lock.js.coffee
//= require form.js.coffee

//= require extern/jquery/jquery.js
//= require mobile/jquery.mobile.js
//= require extern/jquery.mobile/jquery.mobile.js
//= require extern/handlebars/handlebars.runtime.js

//= require extern/CryptoJS/components/core.js
//= require extern/CryptoJS/components/enc-base64.js
//= require extern/CryptoJS/components/cipher-core.js
//= require extern/CryptoJS/components/aes.js
//= require extern/CryptoJS/components/sha1.js
//= require extern/CryptoJS/components/hmac.js
//= require extern/CryptoJS/components/pbkdf2.js

//= require js/dropbox.js
//= require js/ui.js
//= require js/handlebars.js
//= require mobile/templates.js

cryptobox.main = {};

cryptobox.main.lock = function() {
	cryptobox.lock.stop();
	$.mobile.changePage("#div-locked", "slideup");
	cryptobox.main.prepare();
	$("#input-password").focus();
}

cryptobox.main.render = function(name, context) {
	$('body').append(cryptobox.ui.render(name, context));
}

cryptobox.main.prepare = function() {
	cryptobox.dropbox.prepare(
		function(url) {
			cryptobox.main.showAlert(false, 'Dropbox authentication required: <p><a href="' + url + '" target="_blank">' + url + '</a></p>');
		},
		function(error) {
			if (error) {
				cryptobox.main.showAlert(true, 'Dropbox authentication error');
			} else {
				cryptobox.main.showAlert(false, 'Successfully restored Dropbox credentials');
			}
		});
}

cryptobox.main.showAlert = function(error, text) {
	$("#div-alert").html(text);
	$("#div-alert").show();
}

cryptobox.main.hideAlert = function() {
	$("#div-alert").hide();
}

$(document).ready(function() {
	cryptobox.main.prepare();
	cryptobox.main.render('locked', this);
	$.mobile.initializePage();
	$("#input-password").focus();

	cryptobox.lock = new Cryptobox.Lock(function() { cryptobox.lock.rewind(); },
		cryptobox.config.lock_timeout_minutes,
		cryptobox.main.lock);

	$('#div-locked').live('pageshow', function(event, data) {
			$(".generated").remove();
	});

	$(".button-lock").live('click', function(event) {
		event.preventDefault();
		cryptobox.main.lock();
	});

	$('.button-login').live('click', function() {
		var el = $.parseJSON($(this).attr('json'));
		if (Cryptobox.form.withToken(el.form))
			cryptobox.main.showAlert(true, "<%= @text[:no_login_with_token] %>");
		else
			Cryptobox.form.login(true, el.form);
	});

	$("#form-unlock").live('submit', function(event) {
		event.preventDefault();

		cryptobox.dropbox.authenticate($("#input-remember").is(':checked'));

		$('#button-unlock').val('<%= @text[:button_unlock_decrypt] %>');
		$("#button-unlock").button("refresh");

		cryptobox.main.hideAlert();

		Cryptobox.open($("#input-password").val(), function(json, error) {
			if (error) {
				$('#button-unlock').val('<%= @text[:button_unlock] %>');
				$("#button-unlock").button("refresh");

				cryptobox.main.showAlert(true, error);
			} else {
				var data = cryptobox.ui.init(json);
				cryptobox.main.render('unlocked', { page: data });
				$("#input-password").val("");
				$("#input-filter").focus();

				cryptobox.lock.start();

				$('#button-unlock').val('<%= @text[:button_unlock] %>');
				$("#button-unlock").button("refresh");

				$.mobile.changePage("#div-main");
			}
		});
	});
});
