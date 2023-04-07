import { Router } from "express";
const doc = Router();
doc.post("/", (req, res) => {
    res.send("List page");
});
export default doc;
