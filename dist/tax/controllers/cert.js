import axios from "axios";
const cert_list = async (token) => {
    const url = "https://qaime.e-taxes.gov.az/service/eroom.getCertList";
    const response = await (await axios.get(url, {
        headers: {
            Cookie: "token=" + token,
        },
    })).data;
    const certs = response.certList.filter((c) => c.voen !== "");
    return { certList: certs };
};
export default cert_list;
