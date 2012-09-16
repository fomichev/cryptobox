function lock() {
	chrome.extension.getBackgroundPage().data = null;

	$("#div-unlocked").hide();
	$("#div-login-error").hide();
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

	var div_matched = '';
	for (var i = 0; i < matched.length; i++) {
		var name = matched[i].name + ' (' + matched[i].form.vars.user + ')';
		div_matched += '<p id="matched_' + i + '"><a href="#">' + name + '</a></p>';
	}

	var div_other = '';
	for (var i = 0; i < unmatched.length; i++) {
		var name = unmatched[i].name + ' (' + unmatched[i].form.vars.user + ')';
		div_other += '<p id="unmatched_' + i +'">' + name + '</p>';
	}

	$("#div-matched").html(div_matched);
	$("#div-other").html(div_other);

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
	$("#button-unlock").button({ icons: { primary: "ui-icon-unlocked" } });
	$("#button-lock").button({ text: false, icons: { primary: "ui-icon-locked" } });
	$("#button-generate-show").button({ text: false, icons: { primary: "ui-icon-gear" } });

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
