import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cbar_api from "./cbar/routers/index.js";
import tax_api from './tax/routers/index.js'
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/api/cbar", cbar_api);
app.use('/api/tax', tax_api)

app.get("/", (req: Request, res: Response) => {
  res.send("APP");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
