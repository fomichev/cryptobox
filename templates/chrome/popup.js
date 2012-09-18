function __headerClick(el) {
	sendToBackground(el);
	window.close();
}

function __detailsClick(el) {
//	$('#div-details .modal-body').html('');
//	getLoginDetails($('#div-details .modal-body'), el);
//	$('#div-details .modal-header h3').text(el.name);
	$('#div-unlocked').slideUp();
	$('#div-details').show();
}

function lock() {
	chrome.extension.getBackgroundPage().data = null;

	$("#div-unlocked").hide();
	$("#div-details").hide();
	$("#div-generate").hide();
	$("#div-login-error").hide();
	$("#div-login-details").hide();
	$("#div-locked").show();

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

		$("#table-matched tbody").html('');
		$("#table-unmatched tbody").html('');
		$('#table-matched').hide();
		$('#table-unmatched').hide();
		if (address == action) {
			cryptobox.bootstrap.createEntry($('#table-matched'), el, __headerClick, __detailsClick);
		} else {
			if (el.visible == true)
				cryptobox.bootstrap.createEntry($('#table-unmatched'), el, __headerClick, __detailsClick);
		}
		$('#table-matched').show();
		$('#table-unmatched').show();
	}
}

function showData(data) {
	$("#div-login-error").hide();
	$("#div-login-details").hide();

	try {
		chrome.tabs.getSelected(null, function (t){
			onUnlock(t, data);

			$("#div-locked").hide();
			$("#div-login-error").hide();
			$("#div-details").hide();
			$("#div-generate").hide();
			$("#div-unlocked").show();

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
		$('#div-unlocked').slideDown();
		$('#div-generate').hide();
	});

	$('#button-generate-show').click(function() {
		$('#div-unlocked').slideUp();
		$('#div-generate').show();
	});

	$('#button-generate').click(function() {
		cryptobox.bootstrap.dialogGenerateSubmit();
	});
}

function dialogDetailsInit() {
	$('#button-hide-details').click(function() {
		$('#div-unlocked').slideDown();
		$('#div-details').hide();
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
