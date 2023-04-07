import { Router } from "express";
const list = Router();

list.post("/", (req, res) => {
  res.send("List page");
});

export default list;
