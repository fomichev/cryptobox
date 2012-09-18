cryptobox.lock = {
	_timeout: 0,
	_timeoutId: 0
};

cryptobox.lock.startTimeout = function(lockCallback) {
	cryptobox.lock._timeout = <%= @config[:ui][:lock_timeout_minutes] %>;
	cryptobox.lock._timeoutId = window.setInterval(function() {
		cryptobox.lock._timeout--;

		if (cryptobox.lock._timeout <= 0) {
			lockTimeoutStop();
			lockCallback();
		}
	}, 1000 * 60);
}

cryptobox.lock.updateTimeout = function() {
	cryptobox.lock._timeout = <%= @config[:ui][:lock_timeout_minutes] %>;
}

cryptobox.lock.stopTimeout = function() {
		clearInterval(cryptobox.lock._timeoutId);
}
