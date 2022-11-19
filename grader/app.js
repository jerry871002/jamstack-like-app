import { connect } from './deps.js';
import { grade } from './grade.js';

const notifyApiServer = (result) => {

}

// const connectRabbitMQ = () => {
//   amqp.connect('amqp://rabbitmq', function (error0, connection) {
//     if (error0) {
//       throw error0;
//     }
//     connection.createChannel(function (error1, channel) {
//       if (error1) {
//         throw error1;
//       }
//       var queue = 'submissions';

//       channel.assertQueue(queue, {
//         durable: false
//       });

//       console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
//       channel.consume(queue, function (msg) {
//         console.log(" [x] Received %s", msg.content.toString());
//         console.log(" [x] Grading the exercise...");
//         const result = grade(msg.content);
//         notifyApiServer(result); // TODO add actual logic inside
//       }, {
//         noAck: true
//       });
//     });
//   });
// }

const connectRabbitMQ = async () => {

  const connection = await connect({
    hostname: 'rabbitmq'
  });
  const channel = await connection.openChannel();

  const queueName = "submissions";
  await channel.declareQueue({ queue: queueName });
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
  await channel.consume(
    { queue: queueName },
    async (args, props, data) => {
      const submission = JSON.parse(new TextDecoder().decode(data));
      console.log(" [x] Received %s", submission);
      console.log(" [x] Grading the exercise...");
      const result = await grade(submission.code);
      console.log(" [x] The result of this submission is %s", result);
      await channel.ack({ deliveryTag: args.deliveryTag });
    },
  );
}

const run = () => {
  connectRabbitMQ();
}

run();