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

httpServer.listen(3000, () => console.log("http://localhost:3000"));
