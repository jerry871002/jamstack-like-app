import { grade } from './grade.js';

const amqp = require('amqplib/callback_api');

const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

const notifyApiServer = (result) => {

}

const createConnection = async () => {
  amqp.connect('amqp://rabbitmq', function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = 'hello';

      channel.assertQueue(queue, {
        durable: false
      });

      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
      channel.consume(queue, function (msg) {
        console.log(" [x] Received %s", msg.content.toString());
        console.log(" [x] Grading the exercise...");
        const result = grade(msg.content);
        notifyApiServer(result); //
      }, {
        noAck: true
      });
    });
  });
}

const run = async () => {
  // wait for the rabbitmq container to be ready
  // looks ugly but I have no better idea
  await delay(10000);
  createConnection();
}

run();