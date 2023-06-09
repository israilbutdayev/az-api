import axios from "axios";
import { Response, Router } from "express";
import { Request_extended } from "../middlewares/auth.js";
const doc = Router();

doc.post("/", async (req: Request_extended, res: Response) => {
  const user_data = req.user_data;
  const token = user_data?.token;
  const url = "https://qaime.e-taxes.gov.az/service/eqaime.printQaime";
  const data = "docOidList%5B%5D=1blg66j0da1lq1";
  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Cookie: `token=${token}`,
    },
  });
  res.json({ ...response.data });
});

export default doc;
