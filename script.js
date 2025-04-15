//Make call to determine browser IP address and callBackFunction with resulting IP address as parameter
function initialiseIpAddress(callBackFunction) {
    const getMyIpUrl = "https://api.ipify.org/?format=json";
    let xhr = new XMLHttpRequest();
    xhr.timeout = 2000;
    xhr.open("GET", getMyIpUrl);
    
    xhr.onload = function() {
        let data = JSON.parse(xhr.response);
        callBackFunction(data.ip);
    }

    xhr.onerror = () => {
        console.log("ip fetch error");
    };
    
      xhr.ontimeout = () => {
        console.log("ip fetch timeout");
    };

    xhr.send();
}

/******************************************TEMP - REMOVE ***************************************** */

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
    xhr.timeout = 2000;
    xhr.open("GET", `https://corsproxy.io/?url=https://api.ip2location.io/?ip=${ip}`);

    xhr.onload = function() {
        let data = JSON.parse(xhr.response);
        geoData = data;
        callBackFunction(data);
    }

    xhr.onerror = () => {
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
    xhr.timeout = 2000;
    xhr.open("GET", `https://restcountries.com/v3.1/alpha/${countryCode}?fields=name,capital,region,languages,area,flags,population`);

    xhr.onload = function() {
        let data = JSON.parse(xhr.response);
        countryData = data;
        callBackFunction(data);
    }

    xhr.onerror = () => {
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
    xhr.timeout = 2000;
    xhr.open("GET", `https://corsproxy.io/?url=https://api.sunrisesunset.io/json?lat=${lat}&lng=${long}`);

    xhr.onload = function() {
        let data = JSON.parse(xhr.response);
        solarData = data.results;
        callBackFunction(data.results);
    }

    xhr.onerror = () => {
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
    xhr.timeout = 2000;
    xhr.open("GET", `https://corsproxy.io/?url=http://api.open-notify.org/astros.json`);

    xhr.onload = function() {
        let data = JSON.parse(xhr.response);
        astroData = data;
        callBackFunction(astroData);
    }

    xhr.onerror = () => {
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
    xhr.timeout = 2000;
    xhr.open("GET", `http://api.open-notify.org/iss-now.json`);

    xhr.onload = function() {
        let data = JSON.parse(xhr.response);
        issData = data;
        callBackFunction(issData);
    }

    xhr.onerror = () => {
        console.log("initialiseAstronauts fetch error");
    };
    
      xhr.ontimeout = () => {
        console.log("initialiseAstronauts fetch timeout");
    };

    xhr.send();
}

//do stuff with the ip address
function processIpAddress(ip) {
    //display ip address
    document.getElementById("info-ip").innerText = ip;
    //initialise geo-data for ip address
    if (ip) {
        initialiseGeolocationData(ip, processGeolocationData);
    }
    
}

function processGeolocationData(geoData) {
    //display geolocation data
    document.getElementById("info-ip").innerText = 

    //initialise countryData
    if (geoData.country_code) {
        initialiseCountryData(geoData.country_code,processGeolocationData);
    }
    

    //initialise solarData
    if (geoData.latitude && geoData.longitude) {
        initialiseSolarData(geoData.latitude, geoData.longitude,processSolarData);
    }
    
}

function processCountryData(countryData) {
    //display country data
    //display flag
}

function processSolarData(solarData) {
    //show dawn, dusk, length of day and solar noon time
    //configure style based on portion of the day
}

function processAstroData(astroData) {
    //display number of astronauts in space
    document.getElementById("info-astronaut-count").innerText = astroData.number;
}

function processIssData(issData) {
    //display isslocation AND timestamp of location
    document.getElementById("info-iss-latitude").innerText = issData.iss_position.latitude;
    document.getElementById("info-iss-longitude").innerText = issData.iss_position.longitude;
    document.getElementById("info-iss-timestamp").innerText = new Date(issData.timestamp);
}


