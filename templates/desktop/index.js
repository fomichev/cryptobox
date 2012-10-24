// =require extern/jquery/jquery.min.js
// =require extern/bootstrap/js/bootstrap.min.js
// =require extern/handlebars/handlebars.runtime.js

// =require extern/seedrandom/seedrandom.min.js
// =require extern/CryptoJS/components/core-min.js
// =require extern/CryptoJS/components/enc-base64-min.js
// =require extern/CryptoJS/components/cipher-core-min.js
// =require extern/CryptoJS/components/aes-min.js
// =require extern/CryptoJS/components/sha1-min.js
// =require extern/CryptoJS/components/hmac-min.js
// =require extern/CryptoJS/components/pbkdf2-min.js

// =require js/cryptobox.js
// =require js/cipher.js
// =require js/form.js
// =require js/lock.js
// =require js/ui.js
// =require js/password.js
// =require js/handlebars.js
// =require js/bootstrap.js
// =require desktop/index.js
// =require desktop/templates.js

cryptobox.main = {};

cryptobox.main.copyToClipboard = function(text) {
	var t = '';
	var pathToClippy = 'clippy.swf';

	t += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="110" height="14">';
	t += '<param name="movie" value="' + pathToClippy + '"/>';
	t += '<param name="allowScriptAccess" value="always" />';
	t += '<param name="quality" value="high" />';
	t += '<param name="scale" value="noscale" />';
	t += '<param name="FlashVars" value="text=#' + text + '">';
	t += '<param name="bgcolor" value="#fff">';
	t += '<embed src="' + pathToClippy + '" width="110" height="14" name="clippy" quality="high" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" FlashVars="text=' + text + '" bgcolor="#fff" />';
	t += '</object>';

	return t;
}

cryptobox.main.headerClick = function(el) {
	if (cryptobox.form.withToken(el.form)) {
		$('#button-token').attr('href', el.form.action);
		$('#div-token').modal();
	} else {
		cryptobox.form.login(true, el.form);
	}
}

cryptobox.main.detailsClick = function(el) {
	if (el.type == 'webform') {
		$('#div-details .modal-body').html('');

		var values = {
			'<%= @text[:address] %>:': $('<a>', { 'href': el.address }).text(el.address),
			'<%= @text[:username] %>:': cryptobox.bootstrap.collapsible(el.form.vars.user, cryptobox.main.copyToClipboard(el.form.vars.user)),
			'<%= @text[:password] %>:': cryptobox.bootstrap.collapsible(el.form.vars.pass, cryptobox.main.copyToClipboard(el.form.vars.pass))
		};

		if (el.form.vars.secret)
			values['<%= @text[:secret] %>'] = cryptobox.ui.addBr(forms.vars.secret);

		if (el.form.vars.note)
			values['<%= @text[:note] %>'] = cryptobox.ui.addBr(forms.vars.note);

		cryptobox.bootstrap.createDetails($('#div-details .modal-body'), values);
	} else {
		$('#div-details .modal-body').html(el.text);
	}
	$('#div-details .modal-header h3').text(el.name);
	$('#div-details').modal();
}

cryptobox.main.lock = function() {
	cryptobox.lock.stopTimeout();

	cryptobox.bootstrap.render('locked', this);
	$("#input-password").focus();
}

cryptobox.main.dialogGenerateInit = function() {
	$("#button-generate-show").click(function(event) {
		event.preventDefault();
		$("#div-generate").modal();

	});

	$('#button-generate').click(function() {
		cryptobox.bootstrap.dialogGenerateSubmit();
	});
	$("#div-generate").keydown(function(event) {
		if (event.keyCode == $.ui.keyCode.ENTER)
			cryptobox.bootstrap.dialogGenerateSubmit();
	});

	$("#input-pronounceable").click(function() {
		if ($("#input-pronounceable").is(":checked")) {
			$("#input-include-num").attr("disabled", true);
			$("#input-include-punc").attr("disabled", true);
		} else {
			$("#input-include-num").removeAttr("disabled");
			$("#input-include-punc").removeAttr("disabled");
		}
	});
}

cryptobox.main.dialogTokenLoginSubmit = function(url, name, keys, values, tokens) {
	var tokenJson = $.parseJSON($("#input-json").val());

	if (!tokenJson || tokenJson == "")
		return;

	$("#input-json").val("");
	$("#div-token").modal('hide');

	formLogin(true, el.form, tokenJson);
}

cryptobox.main.dialogTokenLoginInit = function() {
	$('#button-token-login').click(function (){
		cryptobox.main.dialogTokenLoginSubmit(url, name, keys, values, tokens);
	});
	$("#div-token").keydown(function(event) {
		if (event.keyCode == $.ui.keyCode.ENTER)
			cryptobox.main.dialogTokenLoginSubmit(url, name, keys, values, tokens);
	});
}

$(function() {
	cryptobox.bootstrap.render('locked', this);
	$("#input-password").focus();

	$("#form-unlock").live('submit', function(event) {
		event.preventDefault();
		try {
			var data = cryptobox.ui.init($("#input-password").val());
			cryptobox.bootstrap.render('unlocked', { page: data });
			$('div.tab-pane:first').addClass('in').addClass('active');
			$('#ul-nav li:first').addClass('active');
			$("#input-filter").focus();

			cryptobox.bootstrap.lockInit(function() { cryptobox.lock.updateTimeout(); }, cryptobox.cfg.lock_timeout_minutes, cryptobox.main.lock);
			cryptobox.main.dialogTokenLoginInit();
			cryptobox.main.dialogGenerateInit();
			cryptobox.bootstrap.filterInit();

			$('.button-login').click(function() {
				var el = $.parseJSON($(this).parent().parent().attr('json'));
				cryptobox.main.headerClick(el);
			});

			$('.button-details').click(function() {
				var el = $.parseJSON($(this).parent().parent().attr('json'));
				cryptobox.main.detailsClick(el);
			});
		} catch(e) {
			alert("<%= @text[:incorrect_password] %> " + e);
			return;
		}
	});
});
