var ThreadUpdate = function() {};

ThreadUpdate.prototype.execute = function(item, err, response, destroy, callback) {

	if (err) {
		item.connection = 'failed';
		item.destroy();
	} else if (response.event == 'response') {

		item.destroy = response.destroy;
		item.connection = 'open';
		if (destroy === true) item.destroy();

	} else if (response.event == 'data') {
		item.position += response.data.length;
	} else if (response.event == 'end') {
		item.connection = 'closed';
		if (item.position < item.end) {
			item.connection = 'failed';
		}
		callback();
	}
};
module.exports = ThreadUpdate;