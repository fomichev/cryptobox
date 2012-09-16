function lock() {
	chrome.extension.getBackgroundPage().data = null;

	$("#div-unlocked").hide();
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
			matched.push(el);
		} else {
			if (el.visible == true)
				unmatched.push(el);
		}
	}

	function createLink(id, name) {
//		return '<div style="clear: both"><div style="float:left" id="' + id +'"><a href="#">' + name + '</a></div><div style="float:right"><a href="#">[Show details]</a></div></div>';
		return '<tr><td id="' + id +'"><a href="#">' + name + '</a></td><td><div class="pull-right"><button class="btn btn-mini btn-primary" type="button"><%= @text[:button_details] %></button></div></td></tr>';
	}

	$("#table-matched tbody").html('');
	$("#table-unmatched tbody").html('');
	$("#table-matched").show();
	$("#table-unmatched").show();

	for (var i = 0; i < matched.length; i++) {
		var name = matched[i].name + ' (' + matched[i].form.vars.user + ')';
		$('#table-matched tbody').append(createLink('matched_' + i, name));
	}
	if (matched.length == 0)
		$('#table-matched').hide();

	for (var i = 0; i < unmatched.length; i++) {
		var name = unmatched[i].name + ' (' + unmatched[i].form.vars.user + ')';
		$('#table-unmatched tbody').append(createLink('unmatched_' + i, name));
	}
	if (unmatched.length == 0)
		$('#table-unmatched').hide();

	function addListenerForMatched(id, form) {
		var e = document.getElementById(id);
		e.addEventListener("click", function() { sendToBackground(form); window.close(); });
	}

	function addListenerForUnmatched(id, form) {
	}

	for (var i = 0; i < matched.length; i++)
		addListenerForMatched("matched_" + i, matched[i]);

	for (var i = 0; i < unmatched.length; i++)
		addListenerForUnmatched("unmatched_" + i, unmatched[i]);

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

$(document).ready(function() {
	$("#button-lock").click(lock);

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

	$("body").mousemove(function() { chrome.extension.getBackgroundPage().lockTimeoutUpdate(); });
});
