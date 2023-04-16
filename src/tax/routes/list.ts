import axios from "axios";
import { Response, Router } from "express";
import { Request_extended } from "../middlewares/auth.js";
import logout from "../controllers/logout.js";
import cert_list from "../controllers/cert.js";

const list = Router();

list.post("/", async (req: Request_extended, res: Response) => {
  const user_data = req.user_data;
  const token = user_data?.token;
  const login_type = user_data?.loginType;
  const token_provided = user_data?.token_provided;
  axios.defaults.headers.Cookie = `token=${token}`;
  axios.defaults.headers["Content-Type"] =
    "application/x-www-form-urlencoded; charset=UTF-8";
  const payload =
    "voen=&wfState=&fromDate=&toDate=&vhfSeria=&vhfNum=&pagination%5Boffset%5D=0&pagination%5Blimit%5D=200";
  const output: { orgId: string[] } = { orgId: [] };
  const url = "https://qaime.e-taxes.gov.az/service/eqaime.getInboxVHF";
  if (token && (login_type === "3" || login_type === "4")) {
    const { certList } = await cert_list(token);
    const cert_url = `https://qaime.e-taxes.gov.az/service/eyeks.changeUserType`;
    for (let i = 0; i < certList?.length; i++) {
      const cert = certList[i];
      const orgId = cert.voen;
      const cert_data = `orgId=${orgId}`;
      const response = await axios.post(cert_url, cert_data);
      if (response.data.response.message === "ok") {
        const response = await axios.post(url, payload);
        output[orgId as keyof typeof output] = [...response?.data?.inboxList];
      }
    }
  } else if (login_type === "0") {
    const response = await axios.post(url, payload);
    const orgId = user_data?.orgId;
    if (orgId) {
      output[orgId as keyof typeof output] = [...response?.data?.inboxList];
    }
    if (token && !token_provided && login_type === "0") {
      await logout(token);
    }
  }
  res.json({ inboxList: output });
});

export default list;
