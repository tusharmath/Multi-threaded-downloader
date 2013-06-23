var should = require('should');
var Factory = require('../lib/Factory');
var FakeModule = require('../lib/core/FakeModule');
var Mocked = require('./mock/mock.requires');
var fs = require('fs');

describe('Module: Factory', function() {


	describe('Methods:', function() {
		var methods = ['register', 'create', 'remove'];


		it('should have methods - ' + methods.join(', '), function() {
			methods.forEach(function(p) {
				Factory.should.have.property(p);
				Factory[p].should.be.a('function');
			});
		});
	});

	describe('registering a module:', function() {

		it('should remove a module', function() {

			Factory.register('FakeModule', 'mock');
			Factory.modules.should.have.property('FakeModule');
			Factory.remove('FakeModule');
			Factory.modules.should.not.have.property('FakeModule');
		});

		it('should register fake module', function() {
			Factory.remove('FakeModule');
			Factory.register('FakeModule', 'mock');

			Factory.modules['FakeModule'].should.equal(FakeModule);

		});

		it('should create requires property in prototype', function() {
			Factory.remove('FakeModule');
			Factory.register('FakeModule', 'mock');


			Factory.modules.FakeModule.prototype.should.have.property('requires');


		});

		it('should load real fs', function() {
			Factory.remove('FakeModule');
			Factory.register('FakeModule');
			Factory.modules.FakeModule.prototype.requires.fs.should.eql(fs);
		});

		it('should add "fake" and "http" to fake module', function() {
			Factory.remove('FakeModule');
			Factory.register('FakeModule', 'mock');

			Factory.modules.FakeModule.prototype.requires.should.have.property('fs');

		});

		it('should create fake object as singleton', function() {
			Factory.remove('FakeModule');
			Factory.register('FakeModule', 'mock singleton');

			var fake1 = Factory.create('FakeModule');
			var fake2 = Factory.create('FakeModule');
			var fake3 = Factory.create('FakeModule', undefined, true);
			fake1.should.equal(fake2);
			fake1.should.eql(fake3);
			fake1.should.not.equal(fake3);
		});
	});



});