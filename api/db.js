import { Client } from './deps.js';

export const connectDB = async () => {
  const env = Deno.env.toObject();
  console.log("env:", env);

  const client = new Client({
    hostname: env.PGHOST,
    database: env.PGDATABASE,
    user: env.PGUSER,
    password: env.PGPASSWORD,
    port: env.PGPORT,
  });
  await client.connect();
  return client;
}

export const queryAllSubmissions = async (client) => {
  const result = await client.queryObject("SELECT * FROM submissions;");
  return result.rows;
}

export const insertSubmission = async (client, { userid, exerciseid, code, result }) => {
  const userAllSubmissions = await querySubmissionsByUser(client, userid);

  let sqlStatement = '';
  if (userAllSubmissions.map(submission => submission.exerciseid).includes(exerciseid)) {
    sqlStatement = "UPDATE submissions SET code=$code, result=$result WHERE userid=$userid AND exerciseid=$exerciseid;"
  } else {
    sqlStatement = "INSERT INTO submissions (userid, exerciseid, code, result) VALUES ($userid, $exerciseid, $code, $result);"
  }

  await client.queryObject(
    sqlStatement,
    {
      userid: userid,
      exerciseid: exerciseid,
      code: code,
      result: result
    }
  );
}

export const querySubmissionsByUser = async (client, userid) => {
  const result = await client.queryObject(
    "SELECT * FROM submissions WHERE userid=$userid;",
    {
      userid: userid
    }
  );
  return result.rows;
}