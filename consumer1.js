#!/usr/bin/env node
// Process tasks from the work queue

var amqp = require('amqplib');

amqp.connect({
    protocol: 'amqp',
    hostname: '172.17.0.2',
    port: 5672,
    username: 'user',
    password: 'password',
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/',
  }).then(function(conn) {
  
    process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {
    var queue = 'q1';
    var ok = ch.assertQueue(queue, {durable: true});
    
    ok = ok.then(function() { ch.prefetch(1); });

    ok = ok.then(function() {
      ch.consume(queue, doWork, {noAck: false});
      console.log(" [*] Waiting for messages. To exit press CTRL+C");
    });
    
    return ok;

    function doWork(msg) {
      var body = msg.content.toString();
      console.log(" [x] Received '%s'", body);
      var secs = body.split('.').length - 1;
      //console.log(" [x] Task takes %d seconds", secs);
      setTimeout(function() {
        console.log(" [x] Done");
        ch.ack(msg);
      }, secs * 1000);
    }
  });
}).catch(console.warn);