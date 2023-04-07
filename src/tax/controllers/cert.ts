import axios from "axios";

interface cert {
  voen: string;
  orgName: string;
  certId: string;
}

interface resp {
  response: {
    code: string;
    message: string;
  };
  token: string;
  certList: cert[];
}

const tokenController = async (token: string) => {
  const url = "https://qaime.e-taxes.gov.az/service/eroom.getCertList";
  const response: resp = await (
    await axios.get(url, {
      headers: {
        Cookie: "token=" + token,
      },
    })
  ).data;
  if (response.response.code === "0" && response.response.message === "ok") {
    return response;
  }
  return false;
};
export default tokenController;
