/**
 * Created by tusharmathur on 5/15/15.
 */
"use strict";
var _ = require('lodash');
var request = require('request');
var fs = require('fs');
var event = require('common-js-pub-sub');
var utils = function (params, ev) {
    var u = {
        //DIRTY METHODS
        onError: function (err) {
            throw err;
        },

        setProperty: function (obj, key, val) {
            obj[key] = val;
        },

        extractAndSetProperty: function (obj, key, func, val) {
            u.setProperty(obj, key, func(val));
        },

        getContentLength: function (res) {
            return parseInt(res.headers['content-length'], 10);
        },

        addParamPosition: function (val) {
            return params.position + val;
        },

        stripFirstParamAsError: function (func) {
            return function (err, res) {
                if (err instanceof Error) {
                    throw err;
                }
                func(res);
            };
        },

        getItemLength: function (item) {
            return item.length;
        },

        writeBufferAtPosition: function (buffer) {
            fs.write(params.fd, buffer, 0, u.getItemLength(buffer), params.position, u.DATA_SAVE);
        },

        makeRequest: function () {
            request(params.uri, params.headers)
                .on('data', u.DATA_RECEIVE)
                .on('response', u.DATA_START)
                .on('error', u.TRIGGER_ERROR)
        },
        updateAndSetPositionOnParams: function (buffer) {
            params.position += buffer.length;
        },
        createTriggerFor: function (eventName) {
            return _.partial(ev.publish, eventName);
        },
        saveDownloadedBytes: function () {
            fs.write(params.fd, JSON.stringify(params), params.totalFileSize, 'utf8', u.METADATA_SAVE)
        }

    };
    //THUNKS (PRETTY METHODS!)
    u.stripErrorParamAndCreateTrigger = _.flow(u.createTriggerFor, u.stripFirstParamAsError);

    //EVENTS
    u.FILE_OPEN = u.stripFirstParamAsError(u.createTriggerFor('FILE_OPEN'));
    u.METADATA_SAVE = u.stripFirstParamAsError(u.createTriggerFor('METADATA_SAVE'));
    u.FILE_TRUNCATE = u.stripFirstParamAsError(u.createTriggerFor('FILE_TRUNCATE'));
    u.DATA_SAVE = u.stripFirstParamAsError(u.createTriggerFor('DATA_SAVE'));
    u.DATA_RECEIVE = u.createTriggerFor('DATA_RECEIVE');
    u.DATA_START = u.createTriggerFor('DATA_START');
    u.FILE_COMPLETE = u.createTriggerFor('FILE_COMPLETE');
    u.TRIGGER_ERROR = _.partial(ev.publish, 'ERROR');

    u.createFileDescriptor = _.partial(_.ary(fs.open, 3), params.path, 'w+', u.FILE_OPEN);
    u.setFileDescriptorOnParams = _.partial(u.setProperty, params, 'fd');
    u.extractAndSetContentLengthOnParams = _.partial(u.extractAndSetProperty, params, 'totalFileSize', u.getContentLength);
    u.setDownloadedBytesOnParams = _.partial(u.setProperty, params, 'downloadedBytes');

    return u;
};

var defaultOptions = {
    headers: {}
};
function download(options) {
    options = _.assign(options, defaultOptions);
    return {
        start: function (cb) {
            var params = {
                position: 0, path: options.path + '.mtd', uri: options.uri
            }, ev = event();
            var u = utils(params, ev);

            //Thunks
            //TODO: Public to test
            ev.subscribe('FILE_COMPLETE', cb);
            ev.subscribe('ERROR', u.onError);

            ev.subscribe('INIT', u.createFileDescriptor);

            ev.subscribe('FILE_OPEN', u.makeRequest);
            ev.subscribe('FILE_OPEN', u.setFileDescriptorOnParams);

            ev.subscribe('DATA_START', u.extractAndSetContentLengthOnParams);

            ev.subscribe('DATA_RECEIVE', u.writeBufferAtPosition);
            ev.subscribe('DATA_RECEIVE', u.updateAndSetPositionOnParams);

            ev.subscribe('DATA_SAVE', u.setDownloadedBytesOnParams);
            ev.subscribe('DATA_SAVE', u.saveDownloadedBytes);

            ev.subscribe('METADATA_SAVE', function () {
                if (params.position === params.totalFileSize) {
                    u.FILE_COMPLETE();
                }
            });

            //START
            ev.publish('INIT', null);

        }
    }
}

exports.utils = utils;
exports.download = download;