import content_disposition from 'content-disposition'
import { Router } from "express";

import { print } from "../controllers/print.js";
const print_router = Router();

print_router.post("/", async (req, res) => {
  const body = req.body;
  const { size, filename, pdf } = await print(body);
  res
    .type("application/pdf")
    .setHeader("Content-Length", size)
    .setHeader("Content-Disposition", content_disposition("attachment; filename=" + filename))
    .send(pdf);
});

export default print_router;
