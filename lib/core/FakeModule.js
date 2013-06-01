var fake = function() {
	this.isFake = true;
};
fake.prototype.using = 'fs http fake';
module.exports = fake;