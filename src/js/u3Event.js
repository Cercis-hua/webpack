function u3Event(){
    this.eventCallbacks = {};
}

u3Event.prototype.on = function (eventType, callback) {
    if( !eventType ) return;
    if( typeof callback !== 'function') return;
    if( !this.eventCallbacks[eventType] ){
        this.eventCallbacks[eventType] = [];
    }
    this.eventCallbacks[eventType].push(callback);
}

u3Event.prototype.emit = function (eventType) {
    if( !eventType ) return;
    var args = Array.prototype.slice.call(arguments, 1);
    if( this.eventCallbacks[eventType] ){
        for( var i = 0, l = this.eventCallbacks[eventType].length; i < l; i++){
            var callback = this.eventCallbacks[eventType][i];
            callback.apply(this,args);
        }
    }
}

u3Event.prototype.removeCallback = function (eventType,cb) {
    if( !eventType ) return;
    if( this.eventCallbacks[eventType] ){
        for( var i = 0, l = this.eventCallbacks[eventType].length; i < l; i++){
            var callback = this.eventCallbacks[eventType][i];
            if(callback === cb){
                this.eventCallbacks[eventType].splice(i,1);
            }
        }
    }
}

u3Event.prototype.getCallbackLength = function (eventType) {
    if( !eventType ) return;
    if( this.eventCallbacks[eventType] ){
        return this.eventCallbacks[eventType].length;
    }else{
        return 0;
    }
}

if(typeof global.u3Emitter === 'undefined'){
    global.u3Emitter = new u3Event();
}

export default u3Event;

