//Require
var ProgressBar = require('progress');

//Variables
var _bars = [];
var interval = 1000;
var _threads;
var timer;


//Privates
var _createBars = function(count) {
	for (var i = 0; i < count; i++) {
		var name = String.fromCharCode(65 + i);
		var bar = new ProgressBar(name + ' [:bar] :percent', {
			total: 20
		});
		_bars.push(bar);
	}
};


var _startTimer = function() {
	timer = setInterval(function() {
		for (var i = 0; i < threads; i++) {
			_bars[i].tick(threads.getStatus(i));
		}
	}, interval);
};



exports.showStatus = function(options) {
	_options = options;
	_createBars(_options.threads);
	_startTimer();
};

var statusTimer;
var seconds = 0;