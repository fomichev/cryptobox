<%= incl(File.join(@config[:path][:templates], 'js/lock.js')) %>

function lock() {
	chrome.extension.getBackgroundPage().data = null;
}

data = null;
