const EventEmitter = require('events');
const Client = require('faye').Client;
const Stream = require('./stream');

class Layer extends EventEmitter {
    constructor(options) {
        super();

        this.buffer = [];

        this.options = Object.assign({
            //default options
        }, options);

        this.streams = {};
        (options.streams || []).forEach((stream) => {
            this.streams[stream.name] = new Stream({
                name    : stream.name,
                layer   : this
            });
        });

        this.initialize();
    }

    initialize() {
        this.service = new Client(this.options.url, {
            timeout : 5,
            retry   : 3
        });

        this.down = true;
        this.service.setHeader('LayerAuth', this.options.token);
        this.service.on('transport:down', () => {
            this.down = true;
            this.emit('down');
        });

        this.service.on('transport:up', ()=>{
            this.down = false;
            this.emit('up');
        });

        this.service.publish('/layer/control', {
            uuid    : this.options.uuid,
            action  : 'initialize'
        });

        this.interval = setInterval(() => {
            this.send();
        }, 1000);
    }

    stream(name) {
        return this.streams[name];
    }

    dispatch(data) {
        this.buffer.push(data);
    }

    send() {
        if (!this.buffer.length || this.down) {
            return;
        }

        this.service.publish('/layer/message', {
            uuid    : this.options.uuid,
            data    : Array.from(this.buffer)
        });

        this.buffer.splice(0);
    }
}

module.exports = Layer;