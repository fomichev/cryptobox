//= require cryptobox.js.coffee

var fill = {};

/* Clipboard copy handler */
chrome.extension.onRequest.addListener(function (msg, sender, sendResponse) {
	var body = document.getElementsByTagName('body') [0];
	var ta = document.createElement('textarea');

	body.appendChild(ta);
	ta.value = msg.text;
	ta.select();
	document.execCommand("copy", false, null);
	body.removeChild(ta);

	sendResponse({});
});

/* Unmatched form fill handler */
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
	if (info.status == 'complete' && tabId in fill) {
		var msg = { type: 'fillForm', cfg: fill[tabId] };
		chrome.tabs.sendMessage(tabId, msg, function() { });
		delete fill[tabId];
	}
});
