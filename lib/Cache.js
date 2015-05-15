/**
 * Created by tusharmathur on 5/15/15.
 */
class Cache {
    constructor (){
        this.__cache = {};
    }
    get (key) {
        return this.__cache;
    }
    set (key, value){
        this.__cache[key] = value;
    }
}
module.exports = Cache;
