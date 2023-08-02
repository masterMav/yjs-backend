const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

// websocket server with the yjs function 
const setupWSConnection =
  require("./node_modules/y-websocket/bin/utils").setupWSConnection;
const wss = new WebSocket.Server({ server: server });

// express server init
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 5000;
server.listen(port, host, () => {
  console.log(`Running at ${port} on host '${host}'.`);
});

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req); 
});

// routes
app.get("/", (req, res) => res.send("Hello World!"));

app.use((req, res) => {
  res.status(404).send("not found 404");
});
