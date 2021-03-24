require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const triggerRoutes = require("./routes/trigger");

// Boot
const app = express();
const port = process.env.PORT || 4000;

// App config
app.use(bodyParser.json());
app.use(cors());

app.use("/api/trigger", triggerRoutes);

app.use((req, res) => {
    return res.status(404).json({ error: "Not Found" })
});

const server = app.listen(port, () => {
    console.log("running server...", port);
});