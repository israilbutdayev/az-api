import axios from "axios";
import { Router } from "express";
import logout from "../controllers/logout.js";
import cert_list from "../controllers/cert.js";
const list = Router();
list.post("/", async (req, res) => {
    const user_data = req.user_data;
    console.log(user_data);
    const token = user_data?.token;
    const user_type = user_data?.userType;
    const token_provided = user_data?.token_provided;
    axios.defaults.headers.Cookie = `token=${token}`;
    axios.defaults.headers["Content-Type"] =
        "application/x-www-form-urlencoded; charset=UTF-8";
    const payload = "voen=&wfState=&fromDate=&toDate=&vhfSeria=&vhfNum=&pagination%5Boffset%5D=0&pagination%5Blimit%5D=200";
    const output = [];
    const url = "https://qaime.e-taxes.gov.az/service/eqaime.getInboxVHF";
    if (token && user_type === "userType_1") {
        const { certList } = await cert_list(token);
        const cert_url = `https://qaime.e-taxes.gov.az/service/eyeks.changeUserType`;
        for (let i = 0; i < certList?.length; i++) {
            const cert = certList[i];
            const orgId = cert.voen;
            const cert_data = `orgId=${orgId}`;
            const response = await axios.post(cert_url, cert_data);
            if (response.data.response.message === "ok") {
                const response = await axios.post(url, payload);
                output.push(...response?.data?.inboxList);
            }
        }
    }
    else if (user_type === "userType_2") {
        const response = await axios.post(url, payload);
        output.push(...response?.data?.inboxList);
        console.log("e");
        if (token && !token_provided && user_type === "userType_2") {
            console.log("f");
            await logout(token);
            //
        }
    }
    res.json({ inboxList: output });
});
export default list;
