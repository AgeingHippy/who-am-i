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

//Make call to determine browser IP address and callBackFunction with resulting IP address as parameter
function initialiseIpAddress(callBackFunction) {
  const getMyIpUrl = "https://api.ipify.org/?format=json";
  let xhr = new XMLHttpRequest();
  xhr.timeout = 2000;
  xhr.open("GET", getMyIpUrl);

  xhr.onload = function () {
    let data = JSON.parse(xhr.response);
    callBackFunction(data.ip);
  };

  xhr.onerror = (event) => {
    console.log("ip fetch error");
  };

  xhr.ontimeout = () => {
    console.log("ip fetch timeout");
  };

  xhr.send();
}

//geolocate ip address and process callback on the resulting object
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
function initialiseGeolocationData(ip, callBackFunction) {
  let xhr = new XMLHttpRequest();
  xhr.timeout = 4000;
  xhr.open(
    "GET",
    `https://corsproxy.io/?url=https://api.ip2location.io/?ip=${ip}`
  );

  xhr.onload = function () {
    let data = JSON.parse(xhr.response);
    geoData = data;
    callBackFunction(data);
  };

  xhr.onerror = (event) => {
    console.log("ip geolocation fetch error");
  };

  xhr.ontimeout = () => {
    console.log("ip geolocation fetch timeout");
  };

  xhr.send();
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
function initialiseCountryData(countryCode, callBackFunction) {
  let xhr = new XMLHttpRequest();
  xhr.timeout = 4000;
  xhr.open(
    "GET",
    `https://restcountries.com/v3.1/alpha/${countryCode}?fields=name,capital,region,languages,area,flags,population`
  );

  xhr.onload = function () {
    let data = JSON.parse(xhr.response);
    countryData = data;
    callBackFunction(data);
  };

  xhr.onerror = (event) => {
    console.log("ip geolocation fetch error");
  };

  xhr.ontimeout = () => {
    console.log("ip geolocation fetch timeout");
  };

  xhr.send();
}

//solar data
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
function initialiseSolarData(lat, long, callBackFunction) {
  let xhr = new XMLHttpRequest();
  xhr.timeout = 4000;
  xhr.open(
    "GET",
    `https://corsproxy.io/?https://api.sunrisesunset.io/json?lat=${lat}&lng=${long}&time_format=24`
  );

  xhr.onload = function () {
    let data = JSON.parse(xhr.response);
    solarData = data.results;
    callBackFunction(data.results);
  };

  xhr.onerror = (event) => {
    console.log("ip geolocation fetch error");
  };

  xhr.ontimeout = () => {
    console.log("ip geolocation fetch timeout");
  };

  xhr.send();
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
function initialiseAstronauts(callBackFunction) {
  let xhr = new XMLHttpRequest();
  xhr.timeout = 4000;
  xhr.open(
    "GET",
    `https://corsproxy.io/?url=http://api.open-notify.org/astros.json`
  );

  xhr.onload = function () {
    let data = JSON.parse(xhr.response);
    astroData = data;
    callBackFunction(astroData);
  };

  xhr.onerror = (event) => {
    console.log("initialiseAstronauts fetch error");
  };

  xhr.ontimeout = () => {
    console.log("initialiseAstronauts fetch timeout");
  };

  xhr.send();
}

//fetch current location of ISS
// {
//     "timestamp": 1744716282,
//     "iss_position": {
//       "longitude": "17.9555",
//       "latitude": "41.5722"
//     },
//     "message": "success"
//   }
function initialiseIss(callBackFunction) {
  let xhr = new XMLHttpRequest();
  xhr.timeout = 4000;
  xhr.open("GET", `https://corsproxy.io/?url=http://api.open-notify.org/iss-now.json`);

  xhr.onload = function () {
    let data = JSON.parse(xhr.response);
    issData = data;
    callBackFunction(issData);
  };

  xhr.onerror = (event) => {
    console.log("initialiseAstronauts fetch error");
  };

  xhr.ontimeout = () => {
    console.log("initialiseAstronauts fetch timeout");
  };

  xhr.send();
}

//do stuff with the ip address
function processIpAddress(ip) {
  //display ip address and time
  document.getElementById("info-ip").innerText = ip;
  let now=new Date();
  document.getElementById("info-time").innerText = now.toTimeString();
  //initialise geo-data for ip address
  if (ip) {
    initialiseGeolocationData(ip, processGeolocationData);
  }
}

function processGeolocationData(geoData) {
  //display geolocation data
  document.getElementById("info-country").innerText = geoData.country_name;
  document.getElementById("info-country-code").innerText = geoData.country_code;
  document.getElementById("info-region").innerText = geoData.region_name;
  document.getElementById("info-city").innerText = geoData.city_name;
  document.getElementById("info-longitude").innerText = geoData.longitude;
  document.getElementById("info-latitude").innerText = geoData.latitude;
  document.getElementById("info-timezone").innerText = geoData.time_zone;

  //initialise countryData
  if (geoData.country_code) {
    initialiseCountryData(geoData.country_code, processCountryData);
  }

  //initialise solarData
  if (geoData.latitude && geoData.longitude) {
    initialiseSolarData(geoData.latitude, geoData.longitude, processSolarData);
  }
}

function processCountryData(countryData) {
  //display country data
  document.getElementById("info-population").innerText = countryData.population;
  document.getElementById("info-area").innerText = countryData.area;
  let languages = ""
  for(let l in countryData.languages) {
    languages += (languages === "" ? languages : languages + " ,")  + countryData.languages[l];
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

function processSolarData(solarData) {
  //show dawn, dusk, length of day and solar noon time
  document.getElementById("info-sunrise").innerText = solarData.sunrise;
  document.getElementById("info-sunset").innerText = solarData.sunset;
  document.getElementById("info-solar-noon").innerText = solarData.solar_noon;
  document.getElementById("info-day-length").innerText = solarData.day_length;

  //configure style based on portion of the day
  let now = new Date();
  let timeNow = now.toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0];
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

function processAstroData(astroData) {
  //display number of astronauts in space
  document.getElementById("info-astronaut-count").innerText = astroData.number;
}

function processIssData(issData) {
  //display isslocation AND timestamp of location
  document.getElementById("info-iss-latitude").innerText =
    issData.iss_position.latitude;
  document.getElementById("info-iss-longitude").innerText =
    issData.iss_position.longitude;
  document.getElementById("info-iss-timestamp").innerText = new Date(
    issData.timestamp
  );
}
