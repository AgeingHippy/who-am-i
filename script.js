//Todo - Figure out how modules and imports work
// import SimDate from './timeSim.js';

//Compare 2 times, each in format HH24:MI:SS
//return 1 if t1 > t2
//return 0 if t1 = t2
//return -1 if t1 < t2
function compareTime(t1, t2) {
  let t1Date = new Date(`1970-01-01T${t1}`);
  let t2Date = new Date(`1970-01-01T${t2}`);

  let result;
  if (t1Date.getTime() > t2Date.getTime()) {
    return 1;
  } else if (t1Date.getTime() == t2Date.getTime()) {
    return 0;
  } else {
    return -1;
  }
}

function displayError(message) {
  console.log(message);
}

//fetch ip address and related data and display
async function getAndDisplayLocation() {
  try {
    let ip = await getIpAddress();

    //display ip address and time
    document.getElementById("info-ip").innerText = ip;

    //get geoLocation data for ip address
    let geoData = await getGeolocationData(ip);

    //display geoLocation data
    displayGeolocationData(geoData);

    //initialise simDate  (Simulated local date according to ip address location)
    simDate = new SimDate(SimDate.timezoneToOffset(geoData.time_zone));
    //display date/time data
    displayTime(simDate);

    getAndDisplayCountryData(geoData.country_code);

    getAndDisplaySolarData(geoData.latitude, geoData.longitude, simDate);

  } catch (error) {
    displayError(`ERROR: ${error.name} ${error.message}`);
  }
}

//Make call to determine and return browser IP address
async function getIpAddress() {
  try {
    let ipResult = await fetch("https://api.ipify.org/?format=json");
    let ipData = await ipResult.json();
    let ip = ipData.ip;
    return ip;
  } catch (error) {
    displayError(`ERROR: ${error.name} ${error.message}`);
    throw new Error("Error determining IP address");
  }
}

//geolocate ip address and return result
// {
//     "ip": "82.15.102.159",
//     "country_code": "GB",
//     "country_name": "United Kingdom of Great Britain and Northern Ireland",
//     "region_name": "England",
//     "city_name": "Bromley",
//     "latitude": 51.40606,
//     "longitude": 0.01519,
//     "zip_code": "BR1",
//     "time_zone": "+01:00",
//     "asn": "5089",
//     "as": "Virgin Media Limited",
//     "is_proxy": false,
//     "message": "Limit to 1,000 queries per day. Sign up for a Free plan at https://www.ip2location.io to get 30K queries per month."
//   }
//using corsproxy.io to get past CORS denied
async function getGeolocationData(ip) {
  try {
    let geoResult = await fetch(
      `https://corsproxy.io/?url=https://api.ip2location.io/?ip=${ip}`
    );
    let geoData = await geoResult.json();
    return geoData;
  } catch (error) {
    displayError(`ERROR: ${error.name} ${error.message}`);
    throw new Error("Error determining geolocation data");
  }
}

//fetch and display country data
async function getAndDisplayCountryData(countryCode) {
  if (countryCode) {
    let countryData = await getCountryData(countryCode);
    displayCountryData(countryData);
  }
}

//Fetch country data for the given country code
//data expected back is as follows
// {
//     "flags": {
//       "png": "https://flagcdn.com/w320/gb.png",
//       "svg": "https://flagcdn.com/gb.svg",
//       "alt": "The flag of the United Kingdom — the Union Jack — has a blue field. It features the white-edged red cross of Saint George superimposed on the diagonal red cross of Saint Patrick which is superimposed on the diagonal white cross of Saint Andrew."
//     },
//     "name": {
//       "common": "United Kingdom",
//       "official": "United Kingdom of Great Britain and Northern Ireland",
//       "nativeName": {
//         "eng": {
//           "official": "United Kingdom of Great Britain and Northern Ireland",
//           "common": "United Kingdom"
//         }
//       }
//     },
//     "capital": [
//       "London"
//     ],
//     "region": "Europe",
//     "languages": {
//       "eng": "English"
//     },
//     "area": 242900,
//     "population": 67215293
//   }
async function getCountryData(countryCode) {
  try {
    let response = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryCode}?fields=name,capital,region,languages,area,flags,population`
    );
    let data = await response.json();
    return data;
  } catch (error) {
    displayError(`ERROR: ${error.name} ${error.message}`);
    throw new Error("Error determining country data");
  }
}

async function getAndDisplaySolarData(lat, long, simDate) {
  let solarData = await getSolarData(lat, long, simDate);
  displaySolarData(simDate, solarData);
}

//get and return solar data
//      {
//       "date": "2025-04-15",
//       "sunrise": "6:05:27 AM",
//       "sunset": "7:56:38 PM",
//       "first_light": "3:57:04 AM",
//       "last_light": "10:05:01 PM",
//       "dawn": "5:30:05 AM",
//       "dusk": "8:32:01 PM",
//       "solar_noon": "1:01:03 PM",
//       "golden_hour": "7:11:42 PM",
//       "day_length": "13:51:10",
//       "timezone": "Europe/London",
//       "utc_offset": 60
//     }
async function getSolarData(lat, long, simDate) {
  try {
    let result = await fetch(
      `https://corsproxy.io/?https://api.sunrisesunset.io/json?lat=${lat}&lng=${long}&time_format=24`
    );
    let data = await result.json();
    return data.results;
  } catch (error) {
    displayError(`ERROR: ${error.name} ${error.message}`);
    throw new Error("Error determining solar data");
  }
}

//fetch count of people in space
// {
//     "people": [
//       {
//         "craft": "ISS",
//         "name": "Oleg Kononenko"
//       },
//       {
//         "craft": "ISS",
//         "name": "Nikolai Chub"
//       },
//       ...
//       ...
//     ],
//     "number": 12,
//     "message": "success"
//   }
async function getAndDiplayAstronauts() {
  try {
    let result = await fetch(
      `https://corsproxy.io/?url=http://api.open-notify.org/astros.json`
    );
    let astroData = await result.json();
    //display number of astronauts in space
    document.getElementById("info-astronaut-count").innerText = astroData.number;
  } catch (error) {
    displayError(`ERROR: ${error.name} ${error.message}`);
  }
}

//fetch and display current location of ISS
// {
//     "timestamp": 1744716282,
//     "iss_position": {
//       "longitude": "17.9555",
//       "latitude": "41.5722"
//     },
//     "message": "success"
//   }
async function getAndDisplayIss() {
  try {
    let result = await fetch(
      `https://corsproxy.io/?url=http://api.open-notify.org/iss-now.json`
    );
    let issData = await result.json();
    //display isslocation AND timestamp of location
    document.getElementById("info-iss-latitude").innerText =
      issData.iss_position.latitude;
    document.getElementById("info-iss-longitude").innerText =
      issData.iss_position.longitude;
    document.getElementById("info-iss-timestamp").innerText = new Date(
      issData.timestamp
    );
  } catch (error) {
    displayError(`ERROR: ${error.name} ${error.message}`);
  }
}

function displayGeolocationData(geoData) {
  //display geolocation data
  document.getElementById("info-country").innerText = geoData.country_name;
  document.getElementById("info-country-code").innerText = geoData.country_code;
  document.getElementById("info-region").innerText = geoData.region_name;
  document.getElementById("info-city").innerText = geoData.city_name;
  document.getElementById("info-longitude").innerText = geoData.longitude;
  document.getElementById("info-latitude").innerText = geoData.latitude;
  document.getElementById("info-timezone").innerText = geoData.time_zone;
}

function displayCountryData(countryData) {
  //display country data
  document.getElementById("info-population").innerText = countryData.population;
  document.getElementById("info-area").innerText = countryData.area;
  let languages = "";
  for (let l in countryData.languages) {
    languages += (languages === "" ? "" : " ,") + countryData.languages[l];
  }
  document.getElementById("info-language").innerText = languages;
  document.getElementById("info-regional-block").innerText = countryData.region;

  //display flag
  document
    .getElementById("country-flag")
    .setAttribute("src", countryData.flags.png);
  document
    .getElementById("country-flag")
    .setAttribute("alt", countryData.flags.alt);
}

function displaySolarData(simDate, solarData) {
  //show dawn, dusk, length of day and solar noon time
  document.getElementById("info-sunrise").innerText = solarData.sunrise;
  document.getElementById("info-sunset").innerText = solarData.sunset;
  document.getElementById("info-solar-noon").innerText = solarData.solar_noon;
  document.getElementById("info-day-length").innerText = solarData.day_length;

  //update display of date/time data
  simDate.setTimeZoneName(solarData.timezone);
  displayTime(simDate);

  //configure style based on portion of the day USING simDate
  let timeNow = simDate.toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0];
  let regex = new RegExp(/.*-theme/);
  Array.from(document.body.classList)
    .filter((className) => regex.test(className))
    .forEach((className) => document.body.classList.remove(className));
  if (
    compareTime(timeNow, solarData.first_light) < 0 ||
    compareTime(timeNow, solarData.last_light) > 0
  ) {
    document.body.classList.add("night-theme");
  } else if (compareTime(timeNow, solarData.dawn) < 0) {
    document.body.classList.add("dawn-theme");
  } else if (compareTime(timeNow, solarData.solar_noon) < 0) {
    document.body.classList.add("morning-theme");
  } else if (compareTime(timeNow, solarData.sunset) < 0) {
    document.body.classList.add("afternoon-theme");
  } else if (compareTime(timeNow, solarData.last_light) < 0) {
    document.body.classList.add("dusk-theme");
  }
}

function displayTime(simDate) {
  document.getElementById("info-time").innerText = simDate.toTimeString();
}
