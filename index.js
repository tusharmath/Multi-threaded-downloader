/**
 * Created by tusharmathur on 5/15/15.
 */
"use strict";
var _ = require('lodash');
var u = {};
var fs = require('fs');
var event = require('common-js-pub-sub');

u.stripFirstParam = function (func){
    return function (err, res){
        if(err instanceof Error){
            throw err;
        }
        func(res);
    };
};
function download(options) {
    return {
        start: function (cb) {
            var ev = event();


            var triggerFileOpen = _.partial(ev.publish, 'file.open');
            var openFile = _.partial(fs.open, 'w+', triggerFileOpen);

            ev.subscribe('init', function (val) {
                fs.open(options.path, 'w+', triggerFileOpen);
            });
            ev.publish('init', {});

        }
    }
}

exports.utils = u;
exports.download = download;