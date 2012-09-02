function lock() {
	lockTimeoutStop();

	$("#div-unlocked").hide();
	$("#div-login-error").hide();
	$("#div-locked").show();
}

function unlock(pwd) {
	var text = decrypt(pwd, cfg.pbkdf2.salt, cfg.ciphertext, cfg.pbkdf2.iterations, cfg.aes.iv);
	return jQuery.parseJSON(text);
}

function onUnlock(tab, data) {
	var matched = new Array();
	var nonmatched = new Array();

	var address = sitename(tab.url);

	for (var i = 0; i < data.length; i++) {
		var el = data[i];
		if (el.type == "magic") {
			if (el.value != "270389")
				throw("@text.incorrect_password@");

			continue;
		}

		var action = sitename(el.form.action);

		if (address == action)
			matched.push(el);
		else
			nonmatched.push(el);
	}

	for (var i = 0; i < matched.length; i++) {
		console.log("a");
	}

	for (var i = 0; i < nonmatched.length; i++) {
		console.log("b");
	}

	p = chrome.tabs.connect(tab.id);
	p.onMessage.addListener(function (e) {
		console.log(e);
	});
}

$(document).ready(function() {
	lock();

	p = chrome.extension.getBackgroundPage();
	console.log('p:');
	console.log(p);


	$("#form-unlock").submit(function(event) {
		event.preventDefault();

	// send message to content.js with form data to fill
	// {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {'xuy': 'xuy'}, function(msg) {
			console.log("sent msg");
		});
		
	 });
	// }


	return;

		$("#div-login-error").hide();

		try {
			var data = unlock($("#input-password").val());
			$("#input-password").val("");

			chrome.tabs.getSelected(null, function (t){ onUnlock(t, data); });

			lockTimeoutStart();

			$("#div-locked").hide();
			$("#div-login-error").hide();
			$("#div-unlocked").show();
		} catch(e) {
			$("#div-login-error").show();
			alert(e);
			return;
		}

	});
});
