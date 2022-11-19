import { serve, connect } from "./deps.js";
import { connectDB, insertSubmission, queryAllSubmissions } from "./db.js";

const dbClient = await connectDB();
let sockets = {};

const httpResponse = (message, status) => {
  return new Response(JSON.stringify({
    'message': message
  }), {
    status: status
  });
}

const submitExercise = async (submission) => {
  console.log('Submitting code to message queue');
  await publishMessage(submission);
}

const publishMessage = async (message) => {
  const connection = await connect({
    hostname: 'rabbitmq'
  });
  const channel = await connection.openChannel();

  const queueName = "submissions";
  await channel.declareQueue({ queue: queueName });
  await channel.publish(
    { routingKey: queueName },
    { contentType: "application/json" },
    new TextEncoder().encode(JSON.stringify(message)),
  );

  await connection.close();
}

const createWebSocketConnection = (request) => {
  console.log("Creating WS connection");
  const { socket, response } = Deno.upgradeWebSocket(request);

  const info = new URL(request.url).searchParams;
  const userid = info.get('userid');
  const exerciseid = info.get('exerciseid');
  const socketid = `${userid}${exerciseid}`;

  socket.onopen = () => {
    console.log('Sending welcome message');
    socket.send(JSON.stringify({
      'message': 'Connection created'
    }));
  }
  socket.onmessage = (e) => console.log(`Received a message: ${e.data}`);
  socket.onclose = () => {
    console.log("WS closed");
    delete sockets[socketid];
  };
  socket.onerror = (e) => console.error("WS error:", e);

  sockets[socketid] = socket;
  console.log(sockets);

  return response;
};

const handleRequest = async (request) => {
  const pathname = new URL(request.url).pathname;
  console.log(`method: ${request.method}, pathname: ${pathname}`);

  if (request.method === 'GET' && pathname === '/') {
    return new Response(JSON.stringify({
      'message': 'api server index'
    }), {
      status: 200
    });
  }

  if (request.method === "POST" && pathname === "/submit") {
    const submission = await request.json();
    console.log(submission);
    await submitExercise(submission);
    return httpResponse('received submission', 201);
  }

  if (request.method === 'POST' && pathname === '/result') {
    const result = await request.json();
    console.log(result);
    await insertSubmission(dbClient, result);

    const dbStatus = await queryAllSubmissions(dbClient);
    console.log(dbStatus);

    const socketid = `${result.userid}${result.exerciseid}`;
    sockets[socketid].send(JSON.stringify(result));

    return httpResponse('received result', 201);
  }

  if (pathname === "/connect") {
    return createWebSocketConnection(request);
  }

  console.error('No matching pathname');
  return httpResponse('page not found', 404);
};

serve(handleRequest, { port: 7777 });