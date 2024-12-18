import express from "express";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(morgan("dev"));
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = createServer(app);
const io = new Server(httpServer);

const Label = {
  NICKNAME: "nickname",
};

io.on("connection", (socket) => {
  socket[Label.NICKNAME] = "Anon";
  socket.onAny((event) => {
    console.log(`socket event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket[Label.NICKNAME]);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket[Label.NICKNAME]),
    );
  });
  socket.on("new_message", (room, msg, done) => {
    socket.to(room).emit("new_message", `${socket[Label.NICKNAME]}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => {
    socket[Label.NICKNAME] = nickname;
  });
});

httpServer.listen(3000, () => console.log("http://localhost:3000"));
