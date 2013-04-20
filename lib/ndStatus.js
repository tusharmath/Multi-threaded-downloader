var showStatus = function() {

	statusTimer = setInterval(function() {
		var str = [];
		var overall = 0;
		seconds++;
		for (var i = 0; i < threads.length; i++) {
			str.push(threads[i].status() + '%');
			overall += threads[i].status();
		}

		console.log(str.join('\t'), "\t|", Math.floor(overall / threads.length).toString() + '% |', Math.round(dataWritten / 1000), "KB/s");
		dataWritten = 0;
	}, 1000);
};