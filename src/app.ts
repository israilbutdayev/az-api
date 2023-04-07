import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cbar_api from "./cbar/routers/indes.ts";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/api/cbar", cbar_api);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
