import axios from "axios";
interface response {
  valid: boolean;
  oid?: string;
  code?: string;
  retry?: boolean;
  token?: string;
}
const asan_login = async (
  asanMob: string,
  asanId: string,
  initial: boolean,
  oid?: string
): Promise<response> => {
  const url = "https://login.e-taxes.gov.az/mSign/mobileSign";
  let payload;
  if (initial) {
    payload = `MLCMD=MOBILE_LOGIN&pinID=${asanId}&phoneNumber=${asanMob}&etoken=&originalIdare=eqaime&xn=`;
  } else {
    payload = `MLCMD=MOBILE_CHECK_STATUS&OID=${oid}&pinID=${asanId}&idare=vroom&originalIdare=eqaime`;
  }
  const response = await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });
  if (initial) {
    const [_, oid, code] = response?.data?.match(
      /MOBILE_LOGIN\$(.*?)\$OUTSTANDING_TRANSACTION\$(.*?)\$/
    );
    return {
      valid: true,
      oid: oid,
      code: code,
    };
  } else {
    if (response.data.includes("OUTSTANDING_TRANSACTION")) {
      return {
        valid: true,
        retry: true,
      };
    } else if (response.data.includes("USER_AUTHENTICATED")) {
      const token = response?.data?.match(/t=(.*?)&/)?.[1];
      return {
        valid: true,
        retry: false,
        token,
      };
    }
  }
  return {
    valid: false,
  };
};

export default asan_login;
