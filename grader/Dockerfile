FROM lukechannings/deno:v1.26.2

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get update
RUN apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin

WORKDIR /app

COPY . .

RUN deno cache deps.js

CMD [ "run", "--allow-net", "--allow-read", "--allow-write", "--allow-run", "app.js" ]