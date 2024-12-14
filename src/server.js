import express from "express";
import morgan from "morgan";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(morgan("dev"));
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("connected to browser");
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((s) => {
          s.send(`${socket.nickname}: ${message.payload}`);
        });
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
  socket.on("close", () => {
    console.log("disconnected from client");
  });
});

server.listen(3000, () => console.log("http://localhost:3000"));
