const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let arr = [];
let clients = [];
app.get("/", (req, res) => {
  res.send(JSON.stringify(arr));
});

app.get("/events", (request, response) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(arr)}\n\n`;

  response.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response,
  };

  clients.push(newClient);

  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
});

function sendEventsToAll(newJoke) {
  clients.forEach((client) =>
    client.response.write(`data: ${JSON.stringify(newJoke)}\n\n`)
  );
}

app.post("/jokes", (request, response) => {
  const newJoke = request.body;
  arr.push(request.body);
  response.json(arr);
  return sendEventsToAll(newJoke);
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
