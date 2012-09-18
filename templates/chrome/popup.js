function show(div) {
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

function loginHeaderClick(el) {
	sendToBackground(el);
	window.close();
}

function loginDetailsClick(el) {
	$('#div-details-body').html('');

	var values = {
		'<%= @text[:username] %>:': el.form.vars.user,
		'<%= @text[:password] %>:': el.form.vars.pass
	};

	cryptobox.bootstrap.createDetails($('#div-details-body'), values);

	show('#div-details');
}

function lock() {
	chrome.extension.getBackgroundPage().data = null;
	show('#div-locked');
	$("#input-password").focus();
}

function unlock(pwd) {
	<% if @config[:chrome][:embed] %>
	var text = cryptobox.cipher.decrypt(pwd, cryptobox.cfg.pbkdf2.salt, cryptobox.cfg.ciphertext, cryptobox.cfg.pbkdf2.iterations, cryptobox.cfg.aes.iv);
	return jQuery.parseJSON(text);
	<% else %>
	// TODO
	return null;
	<% end %>
}

function sendToBackground(r) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, r, function(msg) {
			console.log("sent msg");
		});
	});
}

function onUnlock(tab, data) {
	var matched = new Array();
	var unmatched = new Array();

	var address = cryptobox.form.sitename(tab.url);

	$("#table-matched tbody").html('');
	$("#table-unmatched tbody").html('');
	$('#table-matched').hide();
	$('#table-unmatched').hide();
	for (var i = 0; i < data.length; i++) {
		var el = data[i];
		if (el.type == "magic") {
			if (el.value != "270389")
				throw("<%= @text[:incorrect_password] %>");

			continue;
		}

		if (el.type != 'login')
			continue;

		if (el.form.action == undefined)
			continue;

		var action = cryptobox.form.sitename(el.form.action);

		if (address == action) {
			cryptobox.bootstrap.createEntry($('#table-matched'), el, loginHeaderClick, loginDetailsClick);
		} else {
			if (el.visible == true)
				cryptobox.bootstrap.createEntry($('#table-unmatched'), el, loginHeaderClick, loginDetailsClick);
		}
	}
	$('#table-matched').show();
	$('#table-unmatched').show();
}

function showData(data) {
	$("#div-login-error").hide();
	$("#div-login-details").hide();

	try {
		chrome.tabs.getSelected(null, function (t){
			onUnlock(t, data);
			show("#div-unlocked");
			$("#input-filter").focus();
		});
	} catch(e) {
		$("#div-login-error").show();
		alert(e);
		return;
	}
}

function dialogGenerateInit() {
	$('#button-hide-generate').click(function() {
		show('#div-unlocked');
	});

	$('#button-generate-show').click(function() {
		show('#div-generate');
	});

	$('#button-generate').click(function() {
		cryptobox.bootstrap.dialogGenerateSubmit();
	});
}

function dialogDetailsInit() {
	$('#button-hide-details').click(function() {
		show('#div-unlocked');
	});

}

$(document).ready(function() {
	if (chrome.extension.getBackgroundPage().data != null) {
		chrome.extension.getBackgroundPage().updateTimeout();
		showData(chrome.extension.getBackgroundPage().data);
	} else {
		lock();

		$("#form-unlock").submit(function(event) {
			event.preventDefault();
			var data = unlock($("#input-password").val());
			$("#input-password").val("");

			chrome.extension.getBackgroundPage().startTimeout();
			chrome.extension.getBackgroundPage().data = data;

			showData(data);
		});
	}

	cryptobox.bootstrap.lockInit(function() { chrome.extension.getBackgroundPage().updateTimeout(); });
	cryptobox.bootstrap.filterInit();
	dialogDetailsInit();
	dialogGenerateInit();
});
