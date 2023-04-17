import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import api from "./routes/api.js";
import bodyParser from "body-parser";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use("/api", api);
app.get("/", (req, res) => {
    res.send("APP");
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
