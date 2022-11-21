import http from 'k6/http';
import { sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  const userid = uuidv4();

  const totalExercises = 8;
  const exerciseid = (Math.floor(Math.random() * totalExercises) + 1).toString();

  const codeSolution = 'def some_function(): pass'

  const data = {
    userid: userid,
    exerciseid: exerciseid,
    code: codeSolution
  };

  http.post('http://127.0.0.1:7800/api/submit', JSON.stringify(data));
  sleep(1);
}
