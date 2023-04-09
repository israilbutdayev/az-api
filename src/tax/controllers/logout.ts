import axios from "axios";

interface response {
  valid: boolean;
  token?: string;
}

const logout = async (token: string): Promise<response> => {
  const url = `https://qaime.e-taxes.gov.az/service/eyeks.logout`;
  const response = await axios.post(url, "", {
    headers: {
      Cookie: `token=${token}`,
    },
  });
  return {
    valid: true,
  };
};

export default logout;
