import axios from "axios";
const tokenController = async (token) => {
    const url = "https://qaime.e-taxes.gov.az/service/eroom.getCertList";
    const response = await (await axios.get(url, {
        headers: {
            Cookie: "token=" + token,
        },
    })).data;
    if (response.response.code === "0" && response.response.message === "ok") {
        return response;
    }
    return false;
};
export default tokenController;
