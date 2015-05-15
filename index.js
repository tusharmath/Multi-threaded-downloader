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
            console.log(params.position)
            fs.write(params.fd, buffer, 0, u.getItemLength(buffer), params.position, u.TRIGGER_DATA_SAVE);
        },

        makeRequest: function () {
            request(params.uri, params.headers)
                .on('data', u.TRIGGER_DATA_RECEIVE)
                .on('response', u.TRIGGER_DATA_START)
                .on('error', u.TRIGGER_ERROR)
        },
        updateAndSetPositionOnParams : function (buffer){
            params.position += buffer.length;
        }
    };
    //EVENTS
    u.TRIGGER_FILE_OPEN = u.stripFirstParamAsError(_.partial(ev.publish, 'FILE_OPEN'));
    u.TRIGGER_DATA_SAVE = u.stripFirstParamAsError(_.partial(ev.publish, 'DATA_SAVE'));
    u.TRIGGER_DATA_RECEIVE = _.partial(ev.publish, 'DATA_RECEIVE');
    u.TRIGGER_DATA_START = _.partial(ev.publish, 'DATA_START');
    u.TRIGGER_ERROR = _.partial(ev.publish, 'ERROR');
    //THUNKS (PRETTY METHODS!)
    u.createFileDescriptor = _.partial(_.ary(fs.open, 3), params.path, 'w+', u.TRIGGER_FILE_OPEN);
    u.setFileDescriptorOnParams = _.partial(u.setProperty, params, 'fd');
    u.extractAndSetContentLengthOnParams = _.partial(u.extractAndSetProperty, params, 'totalFileSize', u.getContentLength);
    u.setDownloadedBytes = _.partial(u.setProperty, params, 'downloadedBytes');
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
                position: 0, path: options.path, uri: options.uri
            }, ev = event();
            var u = utils(params, ev);

            //Thunks
            //TODO: Public to test
            ev.subscribe('ERROR', u.onError);

            ev.subscribe('INIT', u.createFileDescriptor);

            ev.subscribe('FILE_OPEN', u.makeRequest);
            ev.subscribe('FILE_OPEN', u.setFileDescriptorOnParams);

            ev.subscribe('DATA_START', u.extractAndSetContentLengthOnParams);

            ev.subscribe('DATA_RECEIVE', u.writeBufferAtPosition);
            ev.subscribe('DATA_RECEIVE', u.updateAndSetPositionOnParams);

            ev.subscribe('DATA_SAVE', u.setDownloadedBytes);

            //START
            ev.publish('INIT', null);

        }
    }
}

exports.utils = utils;
exports.download = download;