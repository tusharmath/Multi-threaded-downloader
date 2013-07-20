/*
var should = require('should');
var async = require('async');
AutoExecuterTask = require('../lib/core/AutoExecuterTask');

var DownloadReader;
describe('AsyncAutoExecuterTask', function() {


	it('test execute method', function(done) {
		var cParams = {
			a: 1,
			b: 2
		};

		var tasksSetup = {
			first: {
				lib: function(a) {
					this.a = a;
					this.execute = function(b) {
						
						this.callback(null, {
							a: this.a * 10,
							b: b * 10

						});
					};

				},
				needs: ['cParams'],
				cParams: ['cParams.a'],
				eParams: ['cParams.b']
			},
			second: {
				lib: function(x, y) {
					this.x = x;
					this.y = y;

					this.execute = function() {
						
						this.callback(null, {
							a: this.x + this.y,
							b: this.x - this.y

						});
					};

				},
				needs: ['cParams'],
				cParams: ['cParams.a', 'cParams.b']
			},
			third: {
				lib: function(x, y) {
					this.x = x;
					this.y = y;

					this.execute = function(p, q) {
						
						this.callback(null, {
							a: this.x,
							b: this.y,
							c: p,
							d: q
						});
					};

				},
				needs: ['first', 'second'],
				cParams: ['first.a', 'first.b'],
				eParams: ['second.a', 'second.b']
			}

		};

		var tasksGenerator = new AutoExecuterTask(tasksSetup, cParams);

		tasksGenerator.callback = function(err, result) {

			result.first.should.eql({
				a: 10,
				b: 20
			});
			result.second.should.eql({
				a: 3,
				b: -1
			});
			result.third.should.eql({
				a: 10,
				b: 20,
				c: 3,
				d: -1
			});
			done();

		};
		tasksGenerator.execute();
	});
});
*/