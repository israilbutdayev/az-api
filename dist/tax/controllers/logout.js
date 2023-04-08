import axios from "axios";
const logout = async (token) => {
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
