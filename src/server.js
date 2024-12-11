import express from "express";
import morgan from "morgan";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(morgan("dev"));
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
app.listen(3000, () => console.log("http://localhost:3000"));
