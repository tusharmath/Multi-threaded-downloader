/**
 * Created by tusharmathur on 7/14/15.
 */
"use strict";
var ObservableStream = require('../src/lib/ObservableStream');
describe('ObservableStream', function () {
    var d;
    beforeEach(function () {
        d = new ObservableStream();
    });

    it("basic stream write", function () {
        var next = () => stream.next().should.deep;
        d.write('AAA').write('BBB');
        var stream = d.stream();
        next().equal({value: 'AAA', done: false});
        next().equal({value: 'BBB', done: false});
        next().equal({value: null, done: false});
        d.end('CCC');
        next().equal({value: 'CCC', done: false});
        next().equal({value: null, done: true});
    });
});