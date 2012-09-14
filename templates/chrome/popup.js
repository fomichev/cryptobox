function lock() {
	lockTimeoutStop();

	$("#div-unlocked").hide();
	$("#div-login-error").hide();
	$("#div-locked").show();
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
	var nonmatched = new Array();

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

		var action = sitename(el.form.action);

		if (address == action)
			matched.push(el);
		else
			nonmatched.push(el);
	}

	var div_matched = '';
	for (var i = 0; i < matched.length; i++) {
		var name = matched[i].name + ' (' + matched[i].form.vars.user + ')';
		div_matched += '<p id="matched_' + i + '">' + name + '</p>';
	}

	var div_other = '';
	for (var i = 0; i < nonmatched.length; i++) {
		var name = nonmatched[i].name + ' (' + nonmatched[i].form.vars.user + ')';
		div_other += '<p>' + name + '</p>';
	}

	$("#div-matched").html(div_matched);
	$("#div-other").html(div_other);

	function addListenerForMatched(id, form) {
		var e = document.getElementById(id);
		e.addEventListener("click", function() { sendToBackground(form); window.close(); });
	}

	for (var i = 0; i < matched.length; i++) {
		addListenerForMatched("matched_" + i, matched[i]);
	}
}

$(document).ready(function() {
	lock();

	$("#form-unlock").submit(function(event) {
		event.preventDefault();

		$("#div-login-error").hide();

		try {
			chrome.tabs.getSelected(null, function (t){
				var data = unlock($("#input-password").val());
				$("#input-password").val("");

				onUnlock(t, data);
				lockTimeoutStart();

				$("#div-locked").hide();
				$("#div-login-error").hide();
				$("#div-unlocked").show();
			});

		} catch(e) {
			$("#div-login-error").show();
			alert(e);
			return;
		}

	});
});
