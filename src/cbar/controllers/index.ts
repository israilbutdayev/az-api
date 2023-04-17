import { Request, Response } from "express";
import axios from "axios";
import jsdom from "jsdom";

interface params {
  from_date: string;
  to_date: string;
  currencies: string[];
}

// axios.defaults.proxy = {
//   protocol: "http",
//   host: "localhost",
//   port: 8866,
// };

const get_currencies = async (req: Request, res: Response) => {
  const req_body = req.body;
  const { from_date, to_date, currencies }: params = {
    from_date: "01/01/2023",
    to_date: "31/12/2023",
    currencies: [],
    ...req_body,
  };
  const { JSDOM } = jsdom;
  const home_url = "https://www.cbar.az";
  const request_home = await axios.get(home_url);
  const csrf_cookie = request_home.headers["set-cookie"]
    ?.find((v) => v.includes("_csrf"))
    ?.split(";")[0];
  const response_home = request_home.data;
  const dom = new JSDOM(response_home);
  const csrf_token =
    dom.window.document.querySelector<HTMLMetaElement>(
      `head > meta[name="csrf-token"]`
    )?.content || "";
  const data = [];
  for (let i = 0; i < currencies.length; i++) {
    const currency = currencies[i];
    const body = `_csrf=${encodeURIComponent(
      csrf_token
    )}&CurrencyForm%5BdateFrom%5D=${encodeURIComponent(
      from_date
    )}&CurrencyForm%5BdateTo%5D=${encodeURIComponent(
      to_date
    )}&CurrencyForm%5BcurrencyCode%5D=${currency}`;
    const response = await (
      await axios.post("https://cbar.az/currency/custom", body, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          cookie: csrf_cookie,
        },
      })
    ).data;
    const currency_dom = new JSDOM(response);
    const table = currency_dom.window.document.querySelector(
      "body > div > div.content_wrap > div > div > div > div.table_wrap > div.table_content > div > div.table_items.table-pagination"
    );
    if (table) {
      data.push(
        [...table?.children].map((tr) => {
          const date = tr.querySelector(".valuta")?.textContent;
          const rate = tr.querySelector(".kod")?.textContent;
          return { currency, date, rate };
        })
      );
    }
  }
  return res.json({
    success: true,
    error: false,
    data,
  });
};
export default get_currencies;
