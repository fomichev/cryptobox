var cryptobox = {};

<%= incl(File.join(@config[:path][:templates], 'js/form.js')) %>

chrome.extension.onMessage.addListener(
	function(message, sender, sendResponse) {
		if (message.type == 'fillForm') {
			cryptobox.form.fill(message.data.form);
		} else if (message.type == 'getFormJson') {
			sendResponse(cryptobox.form.toJson());
		}
	});
