var async = require('async');

var DownloadTask = require('./core/DownloadTask');
var AsyncAutoGenerator = require('./core/AsyncAutoGeneratorTask');

var TaskExecuter = function(file, url, cParams) {
    this.cParams = cParams;
    this.cParams.file = file;
    this.cParams.url = url;

};

var _start = function() {
    var self = this;
    async.waterfall([

    function(callback) {
        var downloadTask = new DownloadTask('new');
        downloadTask.callback = callback;
        downloadTask.execute();
    },

    function(tasks, callback) {
        var asyncAuto = new AsyncAutoGenerator(tasks, self.cParams);
        //console.log('tasks-----:', tasks);
        asyncAuto.callback = callback;
        asyncAuto.execute();
    }],
    self.callback);
};


TaskExecuter.prototype.start = _start;
TaskExecuter.prototype.callback = function(err, results) {

    //TODO: Remove
    console.log('\n---Results\n', results);
};

module.exports = TaskExecuter;