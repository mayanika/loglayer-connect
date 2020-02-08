const Types = {
    INFO    : 0,
    WARNING : 1,
    ERROR   : 2,
    DEBUG   : 4
};

class Stream {
    constructor(options) {
        this.layer = options.layer;
        this.name = options.name;

        if (!this.layer) {
            throw new Error('Layer not set for stream '+options.name);
        }
    }

    error() {
        this.send(Types.ERROR, Array.from(arguments));
    }

    warning() {
        this.send(Types.WARNING, Array.from(arguments));
    }

    info() {
        this.send(Types.INFO, Array.from(arguments));
    }

    debug() {
        this.send(Types.DEBUG, Array.from(arguments));
    }

    send(type, data) {
        this.layer.dispatch({
            stream  : this.name,
            type    : type,
            time    : Date.now(),
            data    : data
        });
    }
}

module.exports = Stream;