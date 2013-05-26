var should = require('should');
var Factory = require('../lib/utils/Factory');
var FakeModule = require('../lib/core/FakeModule');
var fs = require('fs');

describe('Module: Factory', function() {


	describe('Methods:', function() {
		var methods = ['init', 'create'];
		var factory = new Factory;

		it('should have methods - ' + methods.join(', '), function() {
			methods.forEach(function(p) {
				factory.should.have.property(p);
				factory[p].should.be.a('function');
			});
		});
	});


	describe('Working with Mocked objects using init:', function() {
		var factory = new Factory;
		factory.init(true, {
			'FakeModule': 'fs http fake'
		});

		it('should create new instance of fakeModule', function() {
			var fakeModule = factory.create('FakeModule');
			fakeModule.should.be.an.instanceOf(FakeModule);
			should.exist(fakeModule.isFake);
			fakeModule.isFake.should.be.ok;
		});

		it('fakeModule.prototype should have requires', function() {
			should.exist(FakeModule.prototype.requires);
			should.exist(FakeModule.prototype.requires.fs);
			should.exist(FakeModule.prototype.requires.fake);
			should.exist(FakeModule.prototype.requires.http);
		});

		it('fakeModule.prototype should have mocked modules', function() {

			FakeModule.prototype.requires.fake.FakeGlobalModule.should.be.ok;

		});
	});

});