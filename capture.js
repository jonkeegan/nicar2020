const fs = require("fs");
const puppeteer = require("puppeteer");
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterday_formatted = yesterday.toISOString().split('T')[0];
// from : https://stackoverflow.com/questions/16686640/function-to-get-yesterdays-date-in-javascript-in-format-dd-mm-yyyy/16686828

console.log("date: "+yesterday_formatted)

// Here's the page we want to scrape....
let the_url =
  "http://airquality.deq.louisiana.gov/Data/Site/CITYPARK/Date/"+yesterday_formatted;

async function init() {
  try {
    let browser = await puppeteer.launch({
      headless: false,
      incognito: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    // set up puppeteer browser obj....
    let page = await browser.newPage();

    page.setViewport({
      width: 1280,
      height: 2500
    });

    let ua_string =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36";
    page.setUserAgent(ua_string);

    await page.goto(the_url, { waitUntil: "networkidle2" });

    /** These are human behaviors if needed */
    await page.waitFor(2000); // pause
    await page.mouse.move(500, 200); // move mouse
    await page.keyboard.down("PageDown");
    await page.keyboard.down("PageDown");
    await page.waitFor(1000); // pause
    await page.keyboard.down("PageUp");
    // await page.click('input[type="text"]');
    // await page.keyboard.type("Hello there", { delay: 300 });
    await page.setViewport({ width: 2150, height: 1620 });

    let html = await page.content();
    if (typeof html !== "string") {
      console.error("[request_page] start - page.content() is not a string");
      return {};
    }
    // save the HTML in tmp
    fs.writeFileSync(yesterday_formatted+".html", html + "\n");
    // save the screenshot in tmp
    await page.screenshot({
      path: yesterday_formatted+".png",
      fullPage: true
    });

    // close the page
    await page.close();
    await browser.close();
    return true;
  } catch (err) {
    console.log("[request_page] start - Could not execute: " + err);
    return false;
  }
}
init();
