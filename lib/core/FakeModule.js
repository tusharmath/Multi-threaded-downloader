var fake = function() {
	this.isFake = true;
};
fake.prototype.using = 'fs http';
module.exports = fake;