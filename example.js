const LogLayer = require('./lib/layer');

let layer = new LogLayer({
    url         : '', //URL of LogLayer server
    uuid        : '', //UUID of particular layer

    streams     : [
        {name: 'billing'}, // list of application logs stream
        {name: 'security'},
        {name: 'events'}
    ]
});

let billing = layer.stream('billing');

layer.on('up', function(){
    billing.error('ERROR');
    billing.warning('WARNING');
    billing.info('INFO');
    billing.debug('DEbUUGG');

    layer.stream('security').warning('We have a security breach!');
    layer.stream('events').info('Happy new year!');
});

