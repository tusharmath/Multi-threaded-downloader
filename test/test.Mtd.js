var should = require('should');
var Mtd = require('../lib/Mtd');

describe('MTD:', function() {

	it('should have properties', function() {
		var mtd = new Mtd();

		mtd.should.have.property('tasks');
		mtd.should.have.property('start');
		mtd.should.have.property('stop');
		mtd.should.have.property('onHead');
		mtd.should.have.property('onBody');
	});
});