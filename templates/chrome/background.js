var cryptobox = {};

<%= incl(File.join(@config[:path][:templates], 'js/lock.js')) %>

chrome.extension.getBackgroundPage().startTimeout = function() {
	cryptobox.lock.startTimeout(function() {
		chrome.extension.getBackgroundPage().data = null;
	});
}

chrome.extension.getBackgroundPage().updateTimeout = function() {
	cryptobox.lock.updateTimeout();
}

data = null;
