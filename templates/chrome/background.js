var cryptobox = {};

<%= incl(File.join(@config[:path][:templates], 'js/lock.js')) %>

chrome.extension.getBackgroundPage().startTimeout = function() {
	cryptobox.lock.startTimeout(cryptobox.lock.updateTimeout,
		function() { chrome.extension.getBackgroundPage().data = null; }
	);
}

chrome.extension.getBackgroundPage().updateTimeout = function() {
	cryptobox.lock.updateTimeout();
}

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

data = null;
