/**
 * Created by tusharmathur on 5/15/15.
 */
const _ = require('lodash');
class EventHandler {
    constructor() {
        this.listeners = {};

        this.on = function (ev, cb) {
            this.listeners[ev] = this.listeners[ev] || [];
            this.listeners[ev].push(cb);
        }.bind(this);

        this.trigger = function (ev, val) {
            _.each(this.listeners[ev], (c) => c(val));
        }.bind(this);
    }
}

module.exports = EventHandler;