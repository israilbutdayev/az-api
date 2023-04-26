import puppeteer, { PDFOptions } from "puppeteer";
import pdfjs from "pdfjs-dist/legacy/build/pdf.js";
interface body {
  type: string;
  content: string;
  options: {
    fit: boolean;
  };
}
export async function print(body: body) {
  const printOptions: PDFOptions = {
    margin: {
      top: "40px",
      right: "38px",
      bottom: "36px",
      left: "38px",
    },
    printBackground: true,
    format: "A4",
    landscape: true,
    timeout: 0,
  };
  try {
    const {
      type,
      content,
      options: { fit },
    } = body;
    let html: string;
    if (type === "base64") {
      html = Buffer.from(content, "base64").toString("utf-8");
    } else {
      html = content;
    }
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.example.com");
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });
    await page.emulateMediaType("screen");
    await page.addStyleTag({ path: "./src/tax/css/app.css" });
    const seller = await page
      .$("body > p:nth-child(4) > span:nth-child(2)")
      .then((el_handle) => el_handle?.evaluate((el) => el.textContent))
      .catch();
    const buyer = await page
      .$("body > p:nth-child(4) > span:nth-child(5)")
      .then((el_handle) => el_handle?.evaluate((el) => el.textContent))
      .catch();
    const date = await page
      .$("body > div:nth-child(2) > span:nth-child(8)")
      .then((el_handle) => el_handle?.evaluate((el) => el.textContent))
      .catch();
    const ser = await page
      .$("body > div:nth-child(2) > span:nth-child(5)")
      .then((el_handle) => el_handle?.evaluate((el) => el.textContent))
      .catch();
    const num = await page
      .$("body > div:nth-child(2) > span:nth-child(7)")
      .then((el_handle) => el_handle?.evaluate((el) => el.textContent))
      .catch();
    const filename = `${seller} -> ${buyer} @ ${date} ${ser} ${num}`;
    let scale = 1;
    if (fit) {
      const pdf = await page.pdf({ ...printOptions });
      const pdf_data = await pdfjs.getDocument(new Uint8Array(pdf)).promise;
      const page_num_initial = pdf_data.numPages;
      const scales = [];
      let scale_initial = 1;
      scales.push({ scale: scale_initial, page_num: page_num_initial });
      outer: for (let j = 1; j <= 10; j++) {
        const u_bound = 100 + j * 5;
        const l_bound = 100 - j * 5;
        for (let s = u_bound; s >= l_bound; s--) {
          const cur_scale = s / 100;
          if (scales.some((d) => d.scale === cur_scale)) {
            continue;
          }
          const pdf = await page.pdf({ ...printOptions, scale: cur_scale });
          const pdf_data = await pdfjs.getDocument(new Uint8Array(pdf)).promise;
          const cur_page_num = pdf_data.numPages;
          scales.push({ scale: cur_scale, page_num: cur_page_num });
        }
        const sorted_asc = scales.sort((a, b) => a.scale - b.scale);
        const sorted_desc = [...sorted_asc].reverse();
        const asc_index = sorted_asc.findIndex(
          (v) => v.scale >= scale_initial && v.page_num > page_num_initial
        );
        const desc_index = sorted_desc.findIndex(
          (v) => v.scale < scale_initial && v.page_num < page_num_initial
        );
        let max;
        let min;
        if (asc_index >= 0) {
          max = sorted_asc[asc_index - 1];
        }
        if (desc_index >= 0) {
          min = sorted_desc[desc_index];
        }
        if (max && min) {
          if (max.scale - 1 <= 1 - min.scale) {
            scale = max.scale;
          } else {
            scale = min.scale;
          }
          break outer;
        } else if (max) {
          scale = max.scale;
          break outer;
        } else if (min) {
          scale = min.scale;
          break outer;
        }
      }
    }
    const pdf = await page.pdf({ ...printOptions, scale });
    const size = Buffer.byteLength(pdf);
    await browser.close();
    return { size, filename, pdf };
  } catch (error) {
    console.log(error);
    return { size: "", filename: "", pdf: "" };
  }
}
