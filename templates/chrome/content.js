



chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		// TODO: call fillForm with received data

		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		if (request.greeting == "hello")
			sendResponse({farewell: "goodbye"});
	});
