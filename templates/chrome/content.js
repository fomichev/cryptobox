var cryptobox = {};

<%= incl(File.join(@config[:path][:templates], 'js/form.js')) %>

chrome.extension.onMessage.addListener(
	function(msg, sender, sendResponse) {
		if (msg.type == 'fillForm') {
			cryptobox.form.fill(msg.data.form);
			sendResponse({});
		} else if (msg.type == 'getFormJson') {
			sendResponse(cryptobox.form.toJson());
		}
	});
