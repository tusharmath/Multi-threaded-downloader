"use strict";

/**
 * Created by tusharmathur on 5/15/15.
 */
const _ = require('lodash');
const Cache = require('./Cache');
class EventHandler {
    constructor() {
        this.listeners = {};
        this.__cache = new Cache();

        this.on = function (ev, cb, ctx) {
            this.listeners[ev] = this.listeners[ev] || [];
            this.listeners[ev].push(cb.bind(ctx));
        }.bind(this);



        this.trigger = function (ev, val) {
            _.each(this.listeners[ev], (c) => c(val, this.__cache), this);
        }.bind(this);

        this.load = function (obj, ctx){
            _.each(obj, (v,k)=>this.on(k,v,ctx), this);
            this.trigger('init');
        }.bind(this);
    }


}

module.exports = EventHandler;