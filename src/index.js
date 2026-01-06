const express = require("express");
const app = express();

app.get("/health", (req, res) => res.send("OK"));
app.get("/", (req, res) => res.send("HA Platform Running"));

app.listen(3000, () => console.log("Server running"));
