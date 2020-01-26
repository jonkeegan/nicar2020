const fs = require("fs");
const cheerio = require('cheerio'); // cheerio builds a jQuery compatible DOM for you to accesss with jQuery style selectors

// let's define yesterday's date up top...
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
// snippet from : https://stackoverflow.com/questions/16686640/function-to-get-yesterdays-date-in-javascript-in-format-dd-mm-yyyy/16686828
const yesterday_formatted = yesterday.toISOString().split('T')[0];
const yesterday_month = yesterday_formatted.split("-")[1];
const yesterday_day = yesterday_formatted.split("-")[2];


// there's the original URL we were using (so we can keep track of what we scraped and when)
let location = "CITYPARK";
let the_url =
  "http://airquality.deq.louisiana.gov/Data/Site/"+location+"/Date/"+yesterday_formatted;

console.log("date: "+yesterday_formatted);

// Here's the local file we want to parse....
const the_file = location+"/latest/html/"+location+".html";

async function init() {
  try {
    console.log("Parsing data from "+the_file+"....");

    // this loads the DOM of the saved HTML file in a jQuery friendly format, 
    // so we can use familiar '$' style selectors. 
    let $ = cheerio.load(fs.readFileSync(the_file)); 
    let the_json = []; // this is the array that will hold all of our air quality data...

    // let's loop through the tructure of the main table that we want the data from...
    $('div.wrapper table.data tbody tr').each(function(i, elem) { // select all of the table body rows...
        if(i > 0){ // skip the first row...

            // we know the order of each column of data, and it is a fairly small table, so just hardcoding the positions in is OK. 
            // For larger tables (or ones that my change), it is better practice to extract the column headers from the thead elements directly. 

            // Just grab the data for one hour's worth of data as an object, and correctly transfom the data types at this stage. 
            let this_row = {
                'time': $('div.wrapper table.data tbody tr:nth-child('+i+') td:nth-child('+1+')').text(),
                'itemp': parseFloat($('div.wrapper table.data tbody tr:nth-child('+i+') td:nth-child('+2+')').text()),
                'pm10': parseFloat($('div.wrapper table.data tbody tr:nth-child('+i+') td:nth-child('+3+')').text()),
                'pm25': parseFloat($('div.wrapper table.data tbody tr:nth-child('+i+') td:nth-child('+4+')').text()),
                'wdir': parseInt($('div.wrapper table.data tbody tr:nth-child('+i+') td:nth-child('+5+')').text()),
                'wsp': parseInt($('div.wrapper table.data tbody tr:nth-child('+i+') td:nth-child('+6+')').text()),
            };

            // throw this hour into the array of all of our data...
            the_json.push(this_row);
        }
    });

    // It's REALLY important to capture the 'context' of the collection. When and what exact URL? 
    // Maybe even who and part of which collection – this is good practice to capture this metadata
    // in a contet element. Here we'll get the basics: the date of collection and the URL. Ideall this
    // would be at the moment of collection rather than parsing... 
    
    let context = {
        'collection_date': new Date().toISOString(),
        'collection_url': the_url
    }

    // now package up the context and the full data in one neat object...
    let return_data = {
        context: context,
        data: the_json
    }
    
    // Log out the stringified data, so we can see what happened.
    // You could use this instead of writing to files, and just pipe
    // the output from the node script to another tool...
    console.log(JSON.stringify(return_data));

    let archive_year = yesterday.getFullYear();
    let archive_month = yesterday_month;
    let archive_day = yesterday_day;

    // save JSON in the archive directory...
    fs.writeFileSync(location+"/archive/"+archive_year+"/"+archive_month+"/"+archive_day+"/json/"+location+"_"+yesterday_formatted+".json", JSON.stringify(return_data));
    // save JSON in the latest directory...
    fs.writeFileSync(location+"/latest/json/"+location+".json", JSON.stringify(return_data));

  } catch (err) {
    console.log("[init] start - Could not execute: " + err);
    return false;
  }
}
init();