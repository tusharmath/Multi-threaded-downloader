var crypto = require('crypto');
var fs = require('fs');
var config = require('./ndOptions');


exports.checksum = function(fileName, checksum) {
	if (checksum === undefined) return;
	var dType = checksum.split(':')[0];
	var dValue = checksum.split(':')[1];


	var shasum = crypto.createHash(dType);
	var path = config.download_path + fileName;
	var s = fs.ReadStream(path);

	s.on('data', function(d) {
		shasum.update(d);
	});

	s.on('end', function() {
		var d = shasum.digest('hex');

		if (d != dValue) {
			console.log('Digest does\'t match the file');
		} else {
			console.log("File digest matched");
		}
	});
};