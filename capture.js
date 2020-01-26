const fs = require("fs");
const puppeteer = require("puppeteer");
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterday_formatted = yesterday.toISOString().split('T')[0];
const yesterday_month = yesterday_formatted.split("-")[1];
const yesterday_day = yesterday_formatted.split("-")[2];

// from : https://stackoverflow.com/questions/16686640/function-to-get-yesterdays-date-in-javascript-in-format-dd-mm-yyyy/16686828

console.log("date: "+yesterday_formatted)

// Here's the page we want to scrape....
let location = "CITYPARK";
let the_url =
  "http://airquality.deq.louisiana.gov/Data/Site/"+location+"/Date/"+yesterday_formatted;

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

    // set up directories we will need...
/* 
Here's the structure we are going to use to save the files...

CITYPARK/archive/2020/01/26/html/2020-01-26.html
CITYPARK/archive/2020/01/26/screenshot/2020-01-26.png
CITYPARK/archive/2020/01/26/json/2020-01-26.json
CITYPARK/latest/html/CITYPARK.html
CITYPARK/latest/screenshot/CITYPARK.png
CITYPARK/latest/json/CITYPARK.json
*/

// This whole next section just creates the archive directories we want to use. 
// If you were using Amazon S3 to store your data, you wouldn't need to make these
// ahead of time. But it is helpful to have such a standard structre for collections over time. 

    let location_dir = location+"/";

    if (!fs.existsSync(location_dir)){
      fs.mkdirSync(location_dir);
    }
    let archive_dir = location+"/archive/";
    if (!fs.existsSync(archive_dir)){
      fs.mkdirSync(archive_dir);
    }

    if (!fs.existsSync(location+"/latest/")){
      fs.mkdirSync(location+"/latest/");
    }

    let archive_year = yesterday.getFullYear();
    if (!fs.existsSync(location+"/archive/"+archive_year)){
      fs.mkdirSync(location+"/archive/"+archive_year);
    }

    let archive_month = yesterday_month;
  
    if (!fs.existsSync(location+"/archive/"+archive_year+"/"+archive_month)){
      fs.mkdirSync(location+"/archive/"+archive_year+"/"+archive_month);
    }
    let archive_day =yesterday_day;

    if (!fs.existsSync(location+"/archive/"+archive_year+"/"+archive_month+"/"+archive_day)){
      fs.mkdirSync(location+"/archive/"+archive_year+"/"+archive_month+"/"+archive_day);
    }

    let archive_html = archive_year+"/"+yesterday.getMonth()+1;
    if (!fs.existsSync(location+"/archive/"+archive_year+"/"+archive_month+"/"+archive_day+"/html")){
      fs.mkdirSync(location+"/archive/"+archive_year+"/"+archive_month+"/"+archive_day+"/html");
    }

    if (!fs.existsSync(location+"/archive/"+archive_year+"/"+archive_month+"/"+archive_day+"/screenshot")){
      fs.mkdirSync(location+"/archive/"+archive_year+"/"+archive_month+"/"+archive_day+"/screenshot");
    }

    if (!fs.existsSync(location+"/archive/"+archive_year+"/"+archive_month+"/"+archive_day+"/json")){
      fs.mkdirSync(location+"/archive/"+archive_year+"/"+archive_month+"/"+archive_day+"/json");
    }

    if (!fs.existsSync(location+"/latest/html")){
      fs.mkdirSync(location+"/latest/html");
    }

    if (!fs.existsSync(location+"/latest/screenshot")){
      fs.mkdirSync(location+"/latest/screenshot");
    }

    if (!fs.existsSync(location+"/latest/json")){
      fs.mkdirSync(location+"/latest/json");
    }

    // end directory setup...


    // save the HTML
    fs.writeFileSync(location+"/archive/"+archive_year+"/"+archive_month+"/"+archive_day+"/html/"+location+"_"+yesterday_formatted+".html", html + "\n");
    fs.writeFileSync(location+"/latest/html/"+location+".html", html + "\n");

    // save the screenshots
    await page.screenshot({
      path: location+"/archive/"+archive_year+"/"+archive_month+"/"+archive_day+"/screenshot/"+location+"_"+yesterday_formatted+".png",
      fullPage: true
    });
    await page.screenshot({
      path: location+"/latest/screenshot/"+location+".png",
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
