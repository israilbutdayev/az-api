import axios from "axios";
import { Response, Router } from "express";
import { Request_extended } from "../middlewares/auth.js";
import logout from "../controllers/logout.js";
import cert_list from "../controllers/cert.js";

// export interface filter_shape {
//   voen: string;
//   wfState: string;
//   docType: string;
//   fromDate: string;
//   toDate: string;
//   vhfSeria: string;
//   vhfNum: string;
//   "pagination[offset]": string;
//   "pagination[limit]": string;
// }

const f = {
  voen: "",
  wfState: "",
  docType: "",
  fromDate: "",
  toDate: "",
  vhfSeria: "",
  vhfNum: "",
  "pagination[offset]": "",
  "pagination[limit]": "",
};

const orgIds: string[] = ["2003608012"];
interface box_shape {
  [box: string]: {
    path: string;
    resp: string;
  };
}
const boxes: box_shape = {
  inbox: {
    path: "getInboxVHF",
    resp: "inboxList",
  },
  outbox: {
    path: "getOutboxVHF",
    resp: "outboxList",
  },
  draft: {
    path: "getDraftboxVHF",
    resp: "draftboxList",
  },
};

const list = Router();

list.post("/", async (req: Request_extended, res: Response) => {
  const filters = req.body.filters;
  const user_data = req.user_data;
  const token = user_data?.token;
  const login_type = user_data?.loginType;
  const token_provided = user_data?.token_provided;
  axios.defaults.headers.Cookie = `token=${token}`;
  axios.defaults.headers["Content-Type"] =
    "application/x-www-form-urlencoded; charset=UTF-8";
  const output: { orgId: string[] } = { orgId: [] };
  if (token && (login_type === "3" || login_type === "4")) {
    const { certList } = await cert_list(token);
    const cert_url = `https://qaime.e-taxes.gov.az/service/eyeks.changeUserType`;
    if (certList.some((cert) => orgIds.includes(cert.voen))) {
      const certs = certList.filter((cert) => orgIds.includes(cert.voen));
      for (let i = 0; i < certs?.length; i++) {
        const cert = certs[i];
        const orgId = cert.voen;
        const cert_data = `orgId=${orgId}`;
        const response = await axios.post(cert_url, cert_data);
        if (response.data.response.message === "ok") {
          for (let j = 0; j < filters.length; j++) {
            const filter = filters[j];
            const box: string = filter.box;
            const payload = Object.keys(f)
              .map((k) => `${k}=${filter[k] || ""}`)
              .join("&");
            const url = `https://qaime.e-taxes.gov.az/service/eqaime.${boxes[box].path}`;
            const response = await axios.post(url, payload);
            output[orgId as keyof typeof output] = [
              ...response?.data?.[boxes[box].resp],
            ];
          }
        }
      }
    } else {
      return res.json({
        success: false,
        error: true,
        message: "Sizin məlumat götürmə hüququnuz yoxdur.",
      });
    }
  } else if (login_type === "0") {
    if (user_data?.orgId) {
      if (orgIds.includes(user_data?.orgId)) {
        const orgId = user_data?.orgId;
        if (orgId) {
          for (let j = 0; j < filters.length; j++) {
            const filter = filters[j];
            const box: string = filter.box;
            const payload = Object.keys(f)
              .map((k) => `${k}=${filter[k] || ""}`)
              .join("&");
            const url = `https://qaime.e-taxes.gov.az/service/eqaime.${boxes[box].path}`;
            const response = await axios.post(url, payload);
            output[orgId as keyof typeof output] = [
              ...response?.data?.[boxes[box].resp],
            ];
          }
        }
      } else {
        return res.json({
          success: false,
          error: true,
          message: "Sizin məlumat götürmə hüququnuz yoxdur.",
        });
      }
    }
    if (token && !token_provided && login_type === "0") {
      await logout(token);
    }
  }
  res.json({ inboxList: output });
});

export default list;
