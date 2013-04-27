var crypto = require('crypto');
var fs = require('fs');
var config = require('./ndOptions');


exports.checksum = function(fileName, checksum) {
	if (checksum === undefined) return;
	var dType = Object.keys(checksum)[0];
	var dValue = checksum[dType];
	console.log('digest original:', dValue);

	var shasum = crypto.createHash(dType);
	var path = config.download_path + fileName;
	var s = fs.ReadStream(path);

	s.on('data', function(d) {
		shasum.update(d);
	});

	s.on('end', function() {
		var d = shasum.digest('hex');
		console.log('digest calculated:', d);
		if (d != dValue) {
			console.log('Digests don\'t match');
		}
	});
};