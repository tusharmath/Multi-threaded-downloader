var should = require('should');
var Factory = require('../lib/utils/Factory');
Factory.register('Checksum', 'mock');

describe('Module: Checksum', function() {

	describe('Methods:', function() {
		var methods = ['validate', 'onValidate'];

		var checksum = Factory.create('Checksum');
		it('should have methods - ' + methods.join(', '), function() {
			methods.forEach(function(p) {
				checksum.should.have.property(p);
				checksum[p].should.be.a('function');
			});
		});
	});


	describe('Properties:', function() {
		var properties = ['requires'];
		var checksum = Factory.create('Checksum');
		it('should have properties - ' + properties.join(', '), function() {
			properties.forEach(function(p) {
				checksum.should.have.property(p);
			});
		});
	});


	describe('Working:', function() {


		it('should not throw exceptions', function() {
			var checksum = Factory.create('Checksum');
			var check;
			checksum.onValidate = function(result) {
				check = result;
			};
			checksum.validate('', 'sha1:xxxx');
			check.should.be.ok;
			checksum.validate('', 'sha1:yyyy');
			check.should.not.be.ok;

		});

	});
});