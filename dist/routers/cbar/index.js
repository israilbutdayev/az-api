import axios from "axios";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
const home_url = 'https://www.cbar.az';
const resp = await (await axios.get(home_url)).data;
const dom = new JSDOM(resp);
const csrf_token = dom.window.document.querySelector(`head > meta[name="csrf-token"]`)?.content || '';
const from_date = '01/01/2023';
const to_date = '07/04/2023';
const currency = 'usd';
const body = `_csrf=${encodeURIComponent(csrf_token)}&CurrencyForm%5BdateFrom%5D=${encodeURIComponent(from_date)}&CurrencyForm%5BdateTo%5D=${encodeURIComponent(to_date)}&CurrencyForm%5BcurrencyCode%5D=${currency}`;
const response = await (await axios.post("https://cbar.az/currency/custom", body, {
    headers: {
        "content-type": "application/x-www-form-urlencoded",
    },
})).data;
const currency_dom = new JSDOM(response);
const table = currency_dom.window.document.querySelector("#mm-0 > div.content_wrap > div > div > div > div.table_wrap > div.table_content > div > div.table_items.table-pagination.paginate.paginate-0");
