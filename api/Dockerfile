FROM lukechannings/deno:v1.26.2

EXPOSE 7777

WORKDIR /app

COPY . .

RUN deno cache deps.js

CMD [ "run", "--allow-net", "--allow-read", "--allow-run", "--allow-env", "--allow-write", "--no-check", "app.js" ]