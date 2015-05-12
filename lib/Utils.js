var Q = require('q');
var u = {};
u.qromise = function (func) {
    return function (...args) {
        var defer = Q.defer();
        args[func.length - 1] = function (err, res) {
            if (err) {
                return defer.reject(err);
            }
            defer.resolve(res);
        };
        func.apply(null, args);
        return defer.promise;
    };
};

module.exports = u;