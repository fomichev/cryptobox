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

			cryptobox.lock.startTimeout(cryptobox.main.lock);

			$.mobile.changePage("#div-main");
		} catch(e) {
			alert("<%= @text[:incorrect_password] %> " + e);
			return;
		}
	});
});
