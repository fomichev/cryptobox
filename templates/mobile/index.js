// =require extern/jquery/jquery.min.js
// =require mobile/jquery.mobile.js
// =require extern/jquery.mobile/jquery.mobile.min.js
// =require extern/handlebars/handlebars.runtime.js

// =require extern/CryptoJS/components/core-min.js
// =require extern/CryptoJS/components/enc-base64-min.js
// =require extern/CryptoJS/components/cipher-core-min.js
// =require extern/CryptoJS/components/aes-min.js
// =require extern/CryptoJS/components/sha1-min.js
// =require extern/CryptoJS/components/hmac-min.js
// =require extern/CryptoJS/components/pbkdf2-min.js

// =require js/cryptobox.js
// =require js/form.js
// =require js/ui.js
// =require js/handlebars.js
// =require js/cipher.js
// =require js/lock.js
// =require mobile/templates.js

cryptobox.main = {};

cryptobox.main.lock = function() {
	cryptobox.lock.stopTimeout();
	$.mobile.changePage("#div-locked", "slideup");
	$("#input-password").focus();
}

cryptobox.main.render = function(name, context) {
	$('body').append(cryptobox.ui.render(name, context));
}

$(document).ready(function() {
	cryptobox.main.render('locked', this);
	$.mobile.initializePage();
	$("#input-password").focus();

	$('#div-locked').live('pageshow', function(event, data) {
			$(".generated").remove();
	});

	$(".button-lock").live('click', function(event) {
		event.preventDefault();
		cryptobox.main.lock();
	});

	$('.button-login').live('click', function() {
		var el = $.parseJSON($(this).attr('json'));
		if (cryptobox.form.withToken(el.form))
			alert("<%= @text[:no_login_with_token] %>");
		else
			cryptobox.form.login(true, el.form);
	});

	$("#form-unlock").live('submit', function(event) {
		event.preventDefault();

		try {
			var data = cryptobox.ui.init($("#input-password").val());
			cryptobox.main.render('unlocked', { page: data });
			$("#input-password").val("");
			$("#input-filter").focus();

			cryptobox.lock.startTimeout(cryptobox.lock.updateTimeout, cryptobox.cfg.lock_timeout_minutes, cryptobox.main.lock);

			$.mobile.changePage("#div-main");
		} catch(e) {
			alert("<%= @text[:incorrect_password] %> " + e);
			return;
		}
	});
});
