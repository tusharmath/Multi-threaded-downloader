var should = require('should');
var Factory = require('../lib/utils/Factory');
var FakeModule = require('./mock/FakeModule');
describe('Module: Factory', function() {


	describe('Methods:', function() {
		var methods = ['init'];


		it('should have methods - ' + methods.join(', '), function() {
			methods.forEach(function(p) {
				Factory.should.have.property(p);
				Factory[p].should.be.a('function');
			});
		});
	});


	describe('Working with Mocked objects:', function() {

		Factory.init(true);
		it('should load FakeModule', function() {
			Factory.should.have.property('FakeModule');
			Factory.FakeModule.should.be.a('function');
		});

		it('should create new instance of fakeModule', function() {
			var fakeModule = Factory.FakeModule();
			fakeModule.should.be.an.instanceOf(FakeModule);
			should.exist(fakeModule.isFake);
			fakeModule.isFake.should.be.ok;
		});

		it('fakeModule.prototype should have requires', function() {
			should.exist(FakeModule.prototype.requires);
		});

		it('fakeModule.prototype should have mocked modules', function() {

			FakeModule.prototype.requires.fake.FakeGlobalModule.should.be.ok;

		});
	});


	describe('Working:', function() {


	});
});