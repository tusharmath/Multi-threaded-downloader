var _logInline = function(str) {
	process.stdout.clearLine(); // clear current text
	process.stdout.cursorTo(0); // move cursor to beginning of line
	process.stdout.write(str.toString()); // write text
};

exports.logAnalytics = function(status) {
	var _showStatus = function() {
		var status = _getStatus();
		if (config.show_download_status) {
			_logInline(
			[
				'speed: ', status.speed + 'bps',
				'completed:', status.completed + '% ',
				'time:', status.time + 's',
				'eta:', status.eta + 's',
				'data:', status.data
			//'threads:', status.positions.join('|')
			//Random
			].join(' '));
		}
		seconds += config.status_update_every / 1000;

		//	console.log(threads.getStatus());
	};
};