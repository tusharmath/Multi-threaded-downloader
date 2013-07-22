var _ = require('underscore');

var MetaDataUpdater = function(meta) {
	this.meta = meta;
};

var _update_threads = function() {
	_.each(this.meta.threads, function(item){
		item.connection = 'idle';
	});
};

MetaDataUpdater.prototype.execute = function(callback) {
	_update_threads.call(this);
	callback(null, this.meta);
};

module.exports = MetaDataUpdater;