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
//= require desktop/index.js
//= require desktop/templates.js

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
	if (Cryptobox.form.withToken(el.form)) {
		$('#button-token').attr('href', el.form.action);
		$('#div-token').modal();
	} else {
		Cryptobox.form.login(true, el.form);
	}
}

cryptobox.main.detailsClick = function(el) {
	if (el.type == 'webform') {
		$('#div-details .modal-body').html('');

		var values = {
			'<%= @text[:address] %>:': $('<a>', { 'target': '_blank', 'href': el.address }).text(el.address),
			'<%= @text[:username] %>:': cryptobox.bootstrap.collapsible(el.form.vars.user, cryptobox.main.copyToClipboard(el.form.vars.user)),
			'<%= @text[:password] %>:': cryptobox.bootstrap.collapsible(el.form.vars.pass, cryptobox.main.copyToClipboard(el.form.vars.pass))
		};

		if (el.form.vars.secret)
			values['<%= @text[:secret] %>'] = Cryptobox.ui.addBr(forms.vars.secret);

		if (el.form.vars.note)
			values['<%= @text[:note] %>'] = Cryptobox.ui.addBr(forms.vars.note);

		cryptobox.bootstrap.createDetails($('#div-details .modal-body'), values);
	} else {
		$('#div-details .modal-body').html(el.text);
	}
	$('#div-details .modal-header h3').text(el.name);
	$('#div-details').modal();
}

cryptobox.main.lock = function() {
	cryptobox.lock.stop();

	$('#div-token').modal('hide');
	$('#div-details').modal('hide');
	$("#div-generate").modal('hide');

	cryptobox.main.prepare();
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

$(function() {
	cryptobox.main.prepare();
	cryptobox.bootstrap.render('locked', this);
	$("#input-password").focus();

	$("#form-unlock").live('submit', function(event) {
		event.preventDefault();

		cryptobox.dropbox.authenticate($("#input-remember").is(':checked'));

		$('#button-unlock').button('loading');

		cryptobox.bootstrap.hideAlert();

		Cryptobox.open($("#input-password").val(), function(json, error) {
			if (error) {
				$('#button-unlock').button('reset');
				cryptobox.bootstrap.showAlert(true, error);
			} else {
				var data = Cryptobox.ui.init(json);
				cryptobox.bootstrap.render('unlocked', { page: data });

				// try to select Sites tab; otherwise select first one
				if ($('div.tab-pane[id="webform"]')) {
					$('div.tab-pane[id="webform"]').addClass('in').addClass('active');
					$('#ul-nav li a[href="#webform"]').parent().addClass('active');
				} else {
					$('div.tab-pane:first').addClass('in').addClass('active');
					$('#ul-nav li:first').addClass('active');
				}
				$("#input-filter").focus();

				cryptobox.bootstrap.lockInit(
					function() { cryptobox.lock.rewind(); },
					cryptobox.config.lock_timeout_minutes,
					cryptobox.main.lock);
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
			}
		});
	});
});
