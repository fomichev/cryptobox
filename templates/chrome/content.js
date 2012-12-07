//= require js/cryptobox.js
//= require js/form.js

chrome.extension.onMessage.addListener(
	function(msg, sender, sendResponse) {
		if (msg.type == 'fillForm') {
			cryptobox.form.fill(msg.data.form);
			sendResponse({});
		} else if (msg.type == 'getFormJson') {
			sendResponse(cryptobox.form.toJson());
		} else {
			// unknown message
		}
	});

/* Ctrl-\ shortcut */
window.addEventListener("keyup", function (e) {
	if (e.ctrlKey && e.keyCode) {
		if (e.keyCode == 220) {
			/* TODO: we need to add our overlay with popup.html
			 * to the current window because it's not possible
			 * just to show browser action */
		}
	}
} , false);
