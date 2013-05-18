var should = require('should');
var Analytics = require('../lib/core/Analytics');

describe('Module: Analytics', function() {

	it('should be a function', function() {
		Analytics.should.be.a('function');
	});

	var properties = ['getStatus', 'updateStatus'];
	var analytics = new Analytics({});
	properties.forEach(function(p) {
		it('should have property - ' + p, function() {
			analytics.should.have.property(p);
		});

	});


});