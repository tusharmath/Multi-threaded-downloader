var Checksum = function(options) {

};

var _validate = function(path, checksum) {
	var dType = checksum.split(':')[0];
	var dValue = checksum.split(':')[1];


	var shasum = this.requires.crypto.createHash(dType);
	var s = this.requires.fs.ReadStream(path);
	var self = this;
	s.on('data', function(d) {
		shasum.update(d);
	});

	s.on('end', function() {
		var d = shasum.digest('hex');

		if (d != dValue) {
			self.onValidate(false, d, dValue);

		} else {
			self.onValidate(true, d, dValue);
		}
	});

};

Checksum.prototype.validate = _validate;
Checksum.prototype.onValidate = function() {};
Checksum.prototype.using = 'crypto fs';
module.exports = Checksum;