var lockTimeout;
var lockTimeoutId;

function lockTimeoutStart() {
	lockTimeout = <%= @config[:ui][:lock_timeout_minutes] %>;
	lockTimeoutId = window.setInterval(function() {
		lockTimeout--;

		if (lockTimeout <= 0) {
			lockTimeoutStop();
			lock();
		}
	}, 1000 * 60);
}

function lockTimeoutUpdate() {
	lockTimeout = <%= @config[:ui][:lock_timeout_minutes] %>;
}

function lockTimeoutStop() {
		clearInterval(lockTimeoutId);
}
