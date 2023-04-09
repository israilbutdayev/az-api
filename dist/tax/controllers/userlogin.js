import axios from "axios";
const user_login = async (userId, password2, password1) => {
    for (let i = 0; i < 10; i++) {
        try {
            const url = `https://login.e-taxes.gov.az/passLogin/LoginWithPassword `;
            const payload = `username=${userId}&password2=${password2}&password1=${password1}&idare=3&cmd=CORE_REFRESH_EYEKS&eyekscommand=CORE_REFRESH_EYEKS&redirectionpath=context1`;
            const response = await axios.post(url, payload, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
            });
            const json = JSON.parse(response.data.replace(/(\w*?):\s*'(.*?)'/g, `"$1": "$2"`));
            const token = json?.msg?.match(/t=(.*?)&/)?.[1];
            if (token) {
                return {
                    valid: true,
                    token,
                };
            }
            else {
                return {
                    valid: false,
                };
            }
        }
        catch (error) { }
        return {
            valid: false,
        };
    }
    return {
        valid: false,
    };
};
export default user_login;
