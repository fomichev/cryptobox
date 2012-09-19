function headerClick(el) {
	if (cryptobox.form.withToken(el.form)) {
		$('#button-token').attr('href', el.form.action);
		$('#div-token').modal();
	} else {
		cryptobox.form.login(true, el.form);
	}
}

function detailsClick(el) {
	if (el.type == 'login') {
		$('#div-details .modal-body').html('');

		var collapsible = function(value, copy) {
			return '<div class="expand"><a href="#" class="btn btn-mini" data-toggle="button" onClick="javascript:return false;"><%= @text[:button_hide_reveal] %></a>&nbsp;' + copy + '</div><div style="display: none">' + value + '</div>';
		}

		var values = {
			'<%= @text[:address] %>:': $('<a>', { 'href': el.address }).text(el.address),
			'<%= @text[:username] %>:': collapsible(el.form.vars.user, cryptobox.ui.copyToClipboard(el.form.vars.user)),
			'<%= @text[:password] %>:': collapsible(el.form.vars.pass, cryptobox.ui.copyToClipboard(el.form.vars.pass))
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

function lock() {
	cryptobox.lock.stopTimeout();

	render('#locked-template', this);
	$("#input-password").focus();
}

function dialogGenerateInit() {
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

function dialogTokenLoginSubmit(url, name, keys, values, tokens) {
	var tokenJson = eval($("#input-json").val());

	if (!tokenJson || tokenJson == "")
		return;

	$("#input-json").val("");
	$("#div-token").modal('hide');

	formLogin(true, el.form, tokenJson);
}

function dialogTokenLoginInit() {
	$('#button-token-login').click(function (){
		dialogTokenLoginSubmit(url, name, keys, values, tokens);
	});
	$("#div-token").keydown(function(event) {
		if (event.keyCode == $.ui.keyCode.ENTER)
			dialogTokenLoginSubmit(url, name, keys, values, tokens);
	});
}

function render(name, context) {
	$('body').html(cryptobox.ui.render(name, context));
}

$(document).ready(function() {
	render('#locked-template', this);
	$("#input-password").focus();

	$("#form-unlock").live('submit', function(event) {
		event.preventDefault();
		try {
			var data = cryptobox.ui.init($("#input-password").val());
			render('#unlocked-template', { page: data });
			$('#ul-nav a:first').tab('show');
			$("#input-filter").focus();

			cryptobox.bootstrap.lockInit(function() { cryptobox.lock.updateTimeout(); });
			dialogTokenLoginInit();
			dialogGenerateInit();
			cryptobox.bootstrap.filterInit();

			$('.button-login').click(function() {
				var el = $.parseJSON($(this).parent().parent().attr('json'));
				headerClick(el);
			});

			$('.button-details').click(function() {
				var el = $.parseJSON($(this).parent().parent().attr('json'));
				detailsClick(el);
			});
		} catch(e) {
			alert("<%= @text[:incorrect_password] %> " + e);
			return;
		}
	});

	$('.expand').live('click', function() {
		event.preventDefault();

		$(this).next().toggle();
	});
});
