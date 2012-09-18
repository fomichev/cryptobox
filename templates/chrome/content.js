<%= incl(File.join(@config[:path][:templates], 'js/form.js')) %>

chrome.extension.onMessage.addListener(
	function(form, sender, sendResponse) {
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
//		if (request.greeting == "hello")
//			sendResponse({farewell: "goodbye"});

		crypboxo.form.fill(form.form);
	});
