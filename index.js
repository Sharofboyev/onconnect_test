const express = require("express");
const app = express();
const config = require("./config");
const body_parser = require("body-parser");
const server = require("http").createServer();
const {WebSocket, WebSocketServer} = require("ws");
const wss = new WebSocketServer({port: config.socket_port, server: server})

app.use(body_parser.json());

const user = require("./routers/index");

app.use("/", user);

app.use((req, res) => {
    res.status(404).send("Not found")
});

app.use((error, req, res, next) => {
    res.status(400).send(error.message)
})

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}...`)
})