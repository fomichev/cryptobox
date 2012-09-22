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
