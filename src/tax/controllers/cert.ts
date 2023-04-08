import axios from "axios";

interface cert {
  voen: string;
  orgName: string;
  certId: string;
}

interface response {
  certList: cert[];
}

const cert_list = async (token: string): Promise<response> => {
  const url = "https://qaime.e-taxes.gov.az/service/eroom.getCertList";
  const response = await (
    await axios.get(url, {
      headers: {
        Cookie: "token=" + token,
      },
    })
  ).data;
  const certs = response.certList.filter((c: cert) => c.voen !== "");
  return { certList: certs };
};
export default cert_list;
