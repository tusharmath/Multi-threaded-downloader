/*
var should = require('should');
var async = require('async');
WaterfallExecuter = require('../lib/core/WaterfallExecuterTask');

var DownloadReader;
describe('AsyncWaterfallExecuter', function() {


	it('test execute method', function(done) {
		var cParams = {
			a: 1,
			b: 2,
			c: 3,
			d: 4,
			e: 5,
			f: 6,
			g: 7
		};

		var tasksSetup = {
			first: {
				lib: function(a, b, c) {
					this.a = a;
					this.b = b;
					this.c = c;
					this.execute = function(d, e, f) {
						
						this.callback(null, {
							first_a: this.a,
							first_b: this.b,
							first_c: this.c,
							first_d: d,
							first_e: e,
							first_f: f

						});
					};

				},
				cParams: ['a', 'b', 'c'],
				eParams: ['d', 'e', 'f']
			},
			second: {
				lib: function(x, y, z) {
					this.x = x;
					this.y = y;
					this.z = z;
					this.execute = function(p, q, r) {
						
						this.callback(null, {
							second_a: this.x,
							second_b: this.y,
							second_c: this.z,
							second_d: p,
							second_e: q,
							second_f: r
						});
					};

				},
				cParams: ['first_d', 'first_e', 'first_f'],
				eParams: ['first_c', 'first_b', 'first_a']
			}

		};

		var tasksGenerator = new WaterfallExecuter(tasksSetup, cParams);

		tasksGenerator.callback = function(err, result) {


			result.second_a.should.equal(4);
			result.second_b.should.equal(5);
			result.second_c.should.equal(6);
			result.second_d.should.equal(3);
			result.second_e.should.equal(2);
			result.second_f.should.equal(1);
			done();

			//done();
		};
		tasksGenerator.execute();
	});
});
*/