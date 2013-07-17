var fs = require('fs');

var task = function(oldName, newName) {
    this.oldPath = oldName;
    this.newPath = newName;
};
task.prototype.execute = function(callback) {
    this.callback = callback;
    fs.rename(this.oldPath, this.newPath, this.callback);
};

module.exports = task;