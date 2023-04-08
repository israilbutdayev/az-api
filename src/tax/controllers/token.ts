import axios from "axios";
axios.defaults.proxy = {
  protocol: "http",
  host: "localhost",
  port: 8866,
};
export interface response {
  valid: boolean;
  token?: string;
  userType?: string;
  loginType?: string;
  orgId?: string;
  orgName?: string;
}
const token_controller = async (token: string): Promise<response> => {
  for (let i = 0; i < 10; i++) {
    try {
      const url = `https://qaime.e-taxes.gov.az/ssoEyeks?t=${token}&m=1`;
      const response = await axios
        .get(url, {
          maxRedirects: 0,
          validateStatus: (status) => status < 400,
        })
        .catch();
      if (
        response.data.includes(
          `"Bu i&#351; &uuml;&ccedil;&uuml;n &ouml;nc&#601; sistem&#601; daxil olmaq laz&#305;md&#305;r."`
        )
      ) {
        console.log("a");
        return {
          valid: false,
        };
      } else if (
        response.data.includes(
          `{error: 'Siz artıq sistemdəsiniz və ya etibarlı çıxış etməmisiniz. Etibarlı çıxış etməmisinizsə 10 dəqiqə heç bir əməliyyat aparmadan gözləyin, sonra yenidən yoxlayın. Etibarlı çıxış etmisinizsə və sizin və ya səlahiyyətli nümayəndənizin sistemdə olmadığından əminsinizsə Telefon Məlumat Xidmətinə (195 nömrəsinə) müraciət edə bilərsiniz.', msg: '' }`
        )
      ) {
        console.log("b");
        return {
          valid: false,
        };
      }
      console.log("c");
      const headers = response.headers;
      const response_token = get_cookie(headers, "token");
      const userType = get_cookie(headers, "userType");
      const loginType = get_cookie(headers, "loginType");
      const orgId = get_cookie(headers, "orgId");
      const orgName = get_cookie(headers, "orgName");
      if (response_token) {
        console.log("d");
        return {
          valid: true,
          token: response_token,
          userType,
          loginType,
          orgId,
          orgName,
        };
      }
    } catch (error) {}
    return {
      valid: false,
    };
  }
  return {
    valid: false,
  };
};

export function get_cookie(headers: any, cookie_name: string): string {
  return headers["set-cookie"]
    ?.find((c: string) => c.startsWith(cookie_name))
    ?.split("; ")[0]
    ?.split("=")?.[1];
}

export default token_controller;
