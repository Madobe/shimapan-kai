const express = require("express");
const app = express();

const init = require("./bot");

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

init();
