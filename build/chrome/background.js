var cryptobox = {};
cryptobox.lock = {
	_timeoutNow: 0,
	_timeoutId: 0
};

cryptobox.lock.startTimeout = function(onMove, timeout, lockCallback) {
	var body = document.getElementsByTagName('body')[0];
	body.addEventListener('mousemove', onMove);

	cryptobox.lock._timeout = timeout;
	cryptobox.lock._timeoutNow = cryptobox.lock._timeout
	cryptobox.lock._timeoutId = window.setInterval(function() {
		cryptobox.lock._timeoutNow--;

		if (cryptobox.lock._timeoutNow <= 0) {
			cryptobox.lock.stopTimeout();
			lockCallback();
		}
	}, 1000 * 60);
}

cryptobox.lock.updateTimeout = function() {
	cryptobox.lock._timeoutNow = cryptobox.lock._timeout;
}

cryptobox.lock.stopTimeout = function() {
	clearInterval(cryptobox.lock._timeoutId);
}
;



var cfg = null;
var fill = {};

chrome.extension.getBackgroundPage().startTimeout = function() {
	cryptobox.lock.startTimeout(cryptobox.lock.updateTimeout,
			chrome.extension.getBackgroundPage().cfg.lock_timeout_minutes,
			function() { chrome.extension.getBackgroundPage().cfg = null; }
	);
}

chrome.extension.getBackgroundPage().updateTimeout = function() {
	cryptobox.lock.updateTimeout();
}

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
