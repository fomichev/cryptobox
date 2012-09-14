<%= incl(File.join(@config[:path][:html], 'js/lock.js')) %>

function lock() {
	chrome.extension.getBackgroundPage().data = null;
}

data = null;
