import { Router } from "express";
import { print } from "../controllers/print.js";
const print_router = Router();

print_router.post("/", async (req, res) => {
  const body = req.body;
  const pdf = await print(body.content);
  res.type("application/pdf");
  res.send(pdf);
});

export default print_router;
