import { Application, Router, Status, Client } from "./deps.js";

const index = async ({ request, response }) => {
  // const formData = await request.formData();
  // const code = formData.get("code");

  // const result = await grade(code);

  console.log(request);
  response.body = {};
};

const submitExercise = async ({ request, response }) => {
  console.log(request);
  response.body = { 'message': 'submitting exercise' };
}

const router = new Router();
router.get("/", index);
router.post("/submit", submitExercise);

const app = new Application();
app.use(router.routes());
app.listen({ port: 7777 });