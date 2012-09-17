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
	$("#div-login-error").hide();
	$("#div-login-details").hide();
	$("#div-locked").show();

	$("#input-password").focus();
}

function unlock(pwd) {
	<% if @config[:chrome][:embed] %>
	var text = decrypt(pwd, cfg.pbkdf2.salt, cfg.ciphertext, cfg.pbkdf2.iterations, cfg.aes.iv);
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

	var address = sitename(tab.url);

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

		var action = sitename(el.form.action);

		if (address == action) {
			uiCreateEntry($('#table-matched'), el);
		} else {
			if (el.visible == true)
				uiCreateEntry($('#table-unmatched'), el);
		}
	}

	/*
	function createLink(id, name) {
		return '<tr><td id="' + id +'"><a href="#">' + name + '</a></td><td><div class="pull-right"><button id="' + id + '_button" class="btn btn-mini btn-primary" type="button" data-toggle="button"><%= @text[:button_details] %></button></div></td></tr>';
	}
	function createDetails(id, user, pass) {
		var t = '<dl class="dl-horizontal"><dt><%= @text[:username] %>:</dt><dd>' + user + '</dd><dt><%= @text[:password] %>:</dt><dd>' + pass + '</dd></dl>';

		return '<tr id="'+ id + '_details" style="display:none"><td colspan="2">' + t + '</td></tr>';
	}

	$("#table-matched tbody").html('');
	$("#table-unmatched tbody").html('');
	$("#table-matched").show();
	$("#table-unmatched").show();

	for (var i = 0; i < matched.length; i++) {
		var name = matched[i].name + ' (' + matched[i].form.vars.user + ')';
		$('#table-matched tbody').append(createLink('matched_' + i, name));
		$('#table-matched tbody').append(createDetails('matched_' + i, matched[i].form.vars.user, matched[i].form.vars.pass));
	}
	if (matched.length == 0)
		$('#table-matched').hide();

	for (var i = 0; i < unmatched.length; i++) {
		var name = unmatched[i].name + ' (' + unmatched[i].form.vars.user + ')';
		$('#table-unmatched tbody').append(createLink('unmatched_' + i, name));
		$('#table-unmatched tbody').append(createDetails('unmatched_' + i, unmatched[i].form.vars.user, unmatched[i].form.vars.pass));
	}
	if (unmatched.length == 0)
		$('#table-unmatched').hide();

	function addListenerForMatched(id, form) {
		var e = document.getElementById(id);
		e.addEventListener("click", function() { sendToBackground(form); window.close(); });

		e = document.getElementById(id + '_button');
		e.addEventListener("click", function() { $('#' + id + '_details').toggle(); });
	}

	function addListenerForUnmatched(id, form) {
		var e = document.getElementById(id + '_button');
		e.addEventListener("click", function() { $('#' + id + '_details').toggle(); });
	}

	for (var i = 0; i < matched.length; i++)
		addListenerForMatched("matched_" + i, matched[i]);

	for (var i = 0; i < unmatched.length; i++) {
		addListenerForUnmatched("unmatched_" + i, unmatched[i]);
	}
	*/

}

function showData(data) {
	$("#div-login-error").hide();
	$("#div-login-details").hide();

	try {
		chrome.tabs.getSelected(null, function (t){
			onUnlock(t, data);

			$("#div-locked").hide();
			$("#div-login-error").hide();
			$("#div-unlocked").show();

			$("#input-filter").focus();
		});
	} catch(e) {
		$("#div-login-error").show();
		alert(e);
		return;
	}
}

function dialogDetailsInit() {
	$('#a-hide-details').click(function() {
		$('#div-unlocked').slideDown();
		$('#div-details').hide();
	});

}

function lockInit() {
	$("body").mousemove(function() { chrome.extension.getBackgroundPage().locktimeoutupdate(); });

	$("#button-lock").click(function(event) {
		event.preventDefault();
		lock();
	});
}

$(document).ready(function() {
	if (chrome.extension.getBackgroundPage().data != null) {
		chrome.extension.getBackgroundPage().lockTimeoutUpdate();
		showData(chrome.extension.getBackgroundPage().data);
	} else {
		lock();

		$("#form-unlock").submit(function(event) {
			event.preventDefault();
			var data = unlock($("#input-password").val());
			$("#input-password").val("");

			chrome.extension.getBackgroundPage().lockTimeoutStart();
			chrome.extension.getBackgroundPage().data = data;

			showData(data);
		});
	}

	lockInit();
	filterInit();
	dialogDetailsInit();
});
