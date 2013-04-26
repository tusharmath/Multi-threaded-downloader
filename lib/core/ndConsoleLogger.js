var config = require('./ndOptions');
var _logInline = function(str) {
	process.stdout.clearLine(); // clear current text
	process.stdout.cursorTo(0); // move cursor to beginning of line
	process.stdout.write(str.toString()); // write text
};

exports.logAnalytics = function(status) {


	if (config.show_download_status) {
		_logInline(
		[
			'speed: ', status.speed + 'bps',
			'completed:', status.completed + '% ',
			'time:', status.time + 's',
			'eta:', status.eta + 's',
			'data:', status.data,
			'active:', status.active
		//'threads:', status.positions.join('|')
		//Random
		].join(' '));
	}


	//	console.log(threads.getStatus());

};