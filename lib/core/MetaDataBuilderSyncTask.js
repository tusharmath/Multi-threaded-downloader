var task = function(options) {
	var data = JSON.stringify(options);
	var file = options.file;
	if (!file.match(/\.mtd$/)) {
		file = file + '.mtd';
	}
	return {
		data: data,
		file: file
	};
};

module.exports = task;