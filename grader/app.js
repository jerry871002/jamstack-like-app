import { connect } from './deps.js';
import { grade } from './grade.js';


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

      console.log(" [x] Notify API server the result");
      const response = await fetch('http://web:7800/api/result', {
        method: 'POST',
        body: JSON.stringify({
          ...submission,
          result: result
        })
      });
      const responseJSON = await response.json();
      console.log(responseJSON);

      await channel.ack({ deliveryTag: args.deliveryTag });
    },
  );
}

const run = () => {
  connectRabbitMQ();
}

run();