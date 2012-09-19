cryptobox.lock = {
	_timeout: 0,
	_timeoutId: 0
};

cryptobox.lock.startTimeout = function(onMove, lockCallback) {
	var body = document.getElementsByTagName('body')[0];
	body.addEventListener('mousemove', onMove);

	cryptobox.lock._timeout = <%= @config[:ui][:lock_timeout_minutes] %>;
	cryptobox.lock._timeoutId = window.setInterval(function() {
		cryptobox.lock._timeout--;

		if (cryptobox.lock._timeout <= 0) {
			cryptobox.lock.stopTimeout();
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
