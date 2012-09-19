function lock() {
	cryptobox.lock.stopTimeout();
	$.mobile.changePage("#div-locked", "slideup");
	$("#input-password").focus();
}

function render(name, context) {
	$('body').append(cryptobox.ui.render(name, context));
}

$(document).ready(function() {
	render('#locked-template', this);
	$.mobile.initializePage();
	$("#input-password").focus();

	$('#div-locked').live('pageshow', function(event, data) {
			$(".generated").remove();
	});

	$(".button-lock").live('click', function(event) {
		event.preventDefault();
		lock();
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
			render('#unlocked-template', { page: data });
			$("#input-password").val("");
			$("#input-filter").focus();

			cryptobox.lock.startTimeout(lock);

			$.mobile.changePage("#div-main");
		} catch(e) {
			alert("<%= @text[:incorrect_password] %> " + e);
			return;
		}
	});
});
