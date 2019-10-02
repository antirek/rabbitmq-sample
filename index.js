
var amqp = require('amqplib');

amqp.connect({
    protocol: 'amqp',
    hostname: '172.17.0.2',
    port: 5672,
    username: 'user',
    password: 'password',
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 1,
    vhost: '/',
  }).then(function(conn) {

    return conn.createChannel()
      .then(function(ch) {
          var exchange = 'q';
          var queue1 = 'q1';
          var queue2 = 'q2';

          ch.assertExchange(exchange, 'fanout', {durable: true});
          ch.bindQueue(queue1, exchange, '');
          ch.bindQueue(queue2, exchange, '');
          
          for (var i = 0; i < 100; i++) {
              
              var res = ch.publish(exchange, '', Buffer.from(i + ' - hello'));
              console.log('res', i, ' - ', res);
          }
          //})
          
          
      }).finally(function() { 
          //conn.close(); 
      });

}).catch(console.warn);