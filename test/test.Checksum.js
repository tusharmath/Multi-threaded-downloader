var should = require('should');
var Checksum = require('../lib/core/Checksum');
var Mocked = require('./mock/mock.requires');

describe('Module: Checksum', function() {

	it('should be a function', function() {
		Checksum.should.be.a('function');
	});

	describe('Methods:', function() {
		var methods = ['validate', 'onValidate'];

		var checksum = new Checksum({
			requires: {
				fs: Mocked.fs,
				crypto: Mocked.crypto
			}
		});
		it('should have methods - ' + methods.join(', '), function() {
			methods.forEach(function(p) {
				checksum.should.have.property(p);
				checksum[p].should.be.a('function');
			});
		});
	});


	describe('Properties:', function() {
		var properties = ['requires'];
		var checksum = new Checksum({
			requires: {
				fs: Mocked.fs,
				crypto: Mocked.crypto
			}
		});
		it('should have properties - ' + properties.join(', '), function() {
			properties.forEach(function(p) {
				checksum.should.have.property(p);
			});
		});
	});


	describe('Working:', function() {


		it('should not throw exceptions', function() {
			var checksum = new Checksum({
				requires: {
					fs: Mocked.fs,
					crypto: Mocked.crypto
				}
			});
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