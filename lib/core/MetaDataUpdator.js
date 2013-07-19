var _ = require('underscore');

var MetaDataUpdater = function(meta) {
    this.meta = meta;
};

var _update_threads = function() {
    this.meta.threads = _.chain(this.meta.threads).filter(function(item) {
        item.connection = 'idle';
        return item.position < item.end;
    }).value();
};

MetaDataUpdater.prototype.execute = function(callback) {
    _update_threads.call(this);
    callback(null, this.meta);
};

module.exports = MetaDataUpdater;