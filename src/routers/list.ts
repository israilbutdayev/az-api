import { Router } from "express";
const router = Router()

router.post("/", (req, res) => {
  res.send("List page");
});

export default router