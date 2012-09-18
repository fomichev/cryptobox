function __headerClick(el) {
	if (cryptobox.form.withToken(el.form)) {
		$('#button-token').attr('href', el.form.action);
		$('#div-token').modal();
	} else {
		cryptobox.form.login(true, el.form);
	}
}

function __detailsClick(el) {
	if (el.type == 'login') {
		$('#div-details .modal-body').html('');
		getLoginDetails($('#div-details .modal-body'), el);
	} else {
		$('#div-details .modal-body').html(el.text);
	}
	$('#div-details .modal-header h3').text(el.name);
	$('#div-details').modal();
}

function getLoginDetails(entry, el) {
	function setKeyValue(entry, map) {
		var items = $();
		$.each(map, function(k, v) {
			items = items.add($('<dt>').html(k));
			items = items.add($('<dd>').html(v));
		});

		$('<dl>', { 'class': 'dl-horizontal' }).html(items).appendTo(entry);
	}

	function collapsible(value, copy) {
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

	setKeyValue(entry, values);
}

function lock() {
	cryptobox.lock.stopTimeout();

	if ($("#div-locked").is(":visible") && $("#div-unlocked").is(":visible")) {
		$("#div-generate").hide();
		$("#div-details").hide();
		$("#div-token").hide();
		$("#div-unlocked").hide();
	} else {
		$("#div-generate").modal('hide');
		$("#div-details").modal('hide');
		$("#div-token").modal('hide');

		$("#div-locked").fadeIn();
		$("#div-unlocked").hide();
	}

	$(".generated").remove();
	$("#tabs").html('');
	$("#tabs").removeClass();

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

$(document).ready(function() {
	lock();

	/* Unlock */
	$("#form-unlock").submit(function(event) {
		event.preventDefault();
		try {
			cryptobox.ui.init($("#input-password").val(),
				cryptobox.bootstrap.createPage,
				cryptobox.bootstrap.createGroup,
				function(group, el) { cryptobox.bootstrap.createEntry(group, el, __headerClick, __detailsClick); });
			$("#input-password").val("");

			$('#ul-nav a:first').tab('show');

			cryptobox.lock.startTimeout(lock);

			$("#div-locked").hide();
			$("#div-unlocked").fadeIn();

			$("#input-filter").focus();
		} catch(e) {
			alert("<%= @text[:incorrect_password] %> " + e);
			return;
		}
	});

	$('.expand').live('click', function() {
		event.preventDefault();

		$(this).next().toggle();
	});

	cryptobox.bootstrap.lockInit(function() { cryptobox.lock.updateTimeout(); });
	dialogTokenLoginInit();
	dialogGenerateInit();
	cryptobox.bootstrap.filterInit();
});
