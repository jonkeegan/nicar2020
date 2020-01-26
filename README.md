# nicar2020

Scraping with Puppeteer example

This is a simple example of how to scrape a webpage with Puppeteer.

The site we'll be scraping is Louisiana's Air Monitoring Data for [New Orleans City Park](https://www.google.com/maps/place/City+Park/@29.9933929,-90.1003796,17z/data=!3m1!4b1!4m5!3m4!1s0x8620af1590d11e91:0x85b42a0bfac471a9!8m2!3d29.9933929!4d-90.0981909), which can be found here:
http://airquality.deq.louisiana.gov/Data/Site/CITYPARK/Date/2020-01-06

This page publishes hourly air quality data for a number of locations across the state. We'll be looking at New Orleans City Park's data.

Source: https://www.epa.gov/air-trends

## The data

**TIME** is the hour when the data was collected
**ITEMP** is the temperature in degrees celcius
**PM10** describes inhalable particles, with diameters that are generally 10 micrometers and smaller.
**PM2.5** describes fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller.
**WDIR** is the wind direction in degrees
**WSP** is the wind speed in miles per hour

## Requirements

This runs on [Node.js](https://nodejs.org/en/).

Make sure you have `node.js` installed. On the Mac, you can do this quickly with [Homebrew](https://brew.sh/).

```
brew install node
```

## Installation

To run this demo, first clone this repo:

```
git clone https://github.com/jonkeegan/nicar2020.git
```

Then move into that directory you just downloaded.
Now we'll install the required Node packages (We're using [Puppeteer](https://github.com/puppeteer/puppeteer) and [Cheerio](https://cheerio.js.org/)).

```
npm install
```

## Running the scripts

The first script captures the webpage we are collecting. Both the HTML and a screenshot.

To run this first script:

```
node capture.js
```

This will grab yesterday's full set of data (as it is updated hourly).

This is a good structure to use when storing data that you are collecting over time. Use a `latest` directory and a structured date-based `archive` set of directories to store everything. 

Here's the structure we'll be using in this example: 

```
CITYPARK/archive/2020/01/25/html/CITYPARK_2020-01-25.html
CITYPARK/archive/2020/01/25/screenshot/CITYPARK_2020-01-25.png
CITYPARK/archive/2020/01/25/json/2020-01-25.json

CITYPARK/latest/html/CITYPARK.html
CITYPARK/latest/screenshot/CITYPARK.png
CITYPARK/latest/json/CITYPARK.json
```

This makes it really easy to browse through an archive of collected pages, and you can easily peek at the freshest collection. 

This script takes the time to check for and make all the nested directories that you need, but if you store all of your collected data in Amazon S3, you won't even have to do this part (as it doesn't use real directories).


So you will see four new files (and a bunch of directories) upon successfully running this script:

```
CITYPARK/archive/2020/01/25/html/CITYPARK_2020-01-25.html
CITYPARK/archive/2020/01/25/screenshot/CITYPARK_2020-01-25.png
CITYPARK/latest/html/CITYPARK.html
CITYPARK/latest/screenshot/CITYPARK.png
```

That is the full HTML for the page containing yesterday's air quality data, and a screenshot fo the full, rendered webpage.

Next, we want to extract the data from this saved page, and save it as JSON.

```
node extract.js
```

You will now have a two new files that contain your data.
```
CITYPARK/archive/2020/01/25/json/CITYPARK_2020-01-25.json
CITYPARK/latest/json/CITYPARK.json
```

Here's what the final data should look like: 

```javascript
{
  "context": {
    "collection_date": "2020-01-26T20:43:00.476Z",
    "collection_url": "http://airquality.deq.louisiana.gov/Data/Site/CITYPARK/Date/2020-01-25"
  },
  "data": [
    {
      "time": "12:00 AM",
      "itemp": 25.1,
      "pm10": 20.6,
      "pm25": 4.6,
      "wdir": 316,
      "wsp": 1
    },
    {
      "time": "1:00 AM",
      "itemp": 25.1,
      "pm10": 8.8,
      "pm25": 2,
      "wdir": 316,
      "wsp": 2
    },
    {
      "time": "2:00 AM",
      "itemp": 25.1,
      "pm10": 9.3,
      "pm25": 1.7,
      "wdir": 324,
      "wsp": 3
    },
    {
      "time": "3:00 AM",
      "itemp": 25.1,
      "pm10": 6.2,
      "pm25": 1.6,
      "wdir": 345,
      "wsp": 2
    },
    {
      "time": "4:00 AM",
      "itemp": 25,
      "pm10": 3.2,
      "pm25": 1.4,
      "wdir": 164,
      "wsp": 0
    },
    {
      "time": "5:00 AM",
      "itemp": 25.1,
      "pm10": 5.2,
      "pm25": 1.1,
      "wdir": 60,
      "wsp": 1
    },
    {
      "time": "6:00 AM",
      "itemp": 25.1,
      "pm10": 15.1,
      "pm25": 3.1,
      "wdir": 62,
      "wsp": 1
    },
    {
      "time": "7:00 AM",
      "itemp": 25,
      "pm10": 10.8,
      "pm25": 3.1,
      "wdir": 67,
      "wsp": 1
    },
    {
      "time": "8:00 AM",
      "itemp": 25,
      "pm10": 16.2,
      "pm25": 7.2,
      "wdir": 195,
      "wsp": 1
    },
    {
      "time": "9:00 AM",
      "itemp": 24.7,
      "pm10": 50.7,
      "pm25": 14,
      "wdir": 207,
      "wsp": 2
    },
    {
      "time": "10:00 AM",
      "itemp": 24.6,
      "pm10": 24.8,
      "pm25": 6.3,
      "wdir": 19,
      "wsp": 2
    },
    {
      "time": "11:00 AM",
      "itemp": 24.7,
      "pm10": 1.9,
      "pm25": 1.9,
      "wdir": 8,
      "wsp": 4
    },
    {
      "time": "12:00 PM",
      "itemp": 24.8,
      "pm10": 3.2,
      "pm25": 2.4,
      "wdir": 12,
      "wsp": 5
    },
    {
      "time": "1:00 PM",
      "itemp": 25.2,
      "pm10": 2.3,
      "pm25": 1.8,
      "wdir": 19,
      "wsp": 5
    },
    {
      "time": "2:00 PM",
      "itemp": 25.3,
      "pm10": 0,
      "pm25": 2.4,
      "wdir": 39,
      "wsp": 4
    },
    {
      "time": "3:00 PM",
      "itemp": 25.5,
      "pm10": 2.6,
      "pm25": 2.6,
      "wdir": 56,
      "wsp": 3
    },
    {
      "time": "4:00 PM",
      "itemp": 25.6,
      "pm10": 3.2,
      "pm25": 3.5,
      "wdir": 23,
      "wsp": 2
    },
    {
      "time": "5:00 PM",
      "itemp": 25.6,
      "pm10": 4.5,
      "pm25": 2,
      "wdir": 258,
      "wsp": 1
    },
    {
      "time": "6:00 PM",
      "itemp": 25.5,
      "pm10": 23,
      "pm25": 5.2,
      "wdir": 241,
      "wsp": 1
    },
    {
      "time": "7:00 PM",
      "itemp": 25.5,
      "pm10": 16.9,
      "pm25": 2.4,
      "wdir": 191,
      "wsp": 3
    },
    {
      "time": "8:00 PM",
      "itemp": 25.3,
      "pm10": 16.9,
      "pm25": 4.8,
      "wdir": 194,
      "wsp": 4
    },
    {
      "time": "9:00 PM",
      "itemp": 25.2,
      "pm10": 9.4,
      "pm25": 4.3,
      "wdir": 200,
      "wsp": 3
    },
    {
      "time": "10:00 PM",
      "itemp": 25.3,
      "pm10": 14.9,
      "pm25": 4.8,
      "wdir": 180,
      "wsp": 2
    }
  ]
}

```
