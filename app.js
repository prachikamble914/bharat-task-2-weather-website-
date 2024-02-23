// const inputBox = document.querySelector('.input-box');
// const searchBtn = document.getElementById('searchBtn');
// const weather_img = document.querySelector('.weather-img');
// const temperature = document.querySelector('.temperature');
// const description = document.querySelector('.description');
// const humidity = document.getElementById('humidity');
// const wind_speed = document.getElementById('wind-speed');

// const location_not_found = document.querySelector('.location-not-found');

// const weather_body = document.querySelector('.weather-body');


// async function checkWeather(city){
//     const api_key = "4cd0eee81294c867b4bc4cfc64e998c5";
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

//     const weather_data = await fetch(`${url}`).then(response => response.json());


//     if(weather_data.cod === `404`){
//         location_not_found.style.display = "flex";
//         weather_body.style.display = "none";
//         console.log("error");
//         return;
//     }

//     console.log("run");
//     location_not_found.style.display = "none";
//     weather_body.style.display = "flex";
//     temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
//     description.innerHTML = `${weather_data.weather[0].description}`;

//     humidity.innerHTML = `${weather_data.main.humidity}%`;
//     wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;


//     switch(weather_data.weather[0].main){
//         case 'Clouds':
//             weather_img.src = "/assets/cloud.png";
//             break;
//         case 'Clear':
//             weather_img.src = "/assets/clear.png";
//             break;
//         case 'Rain':
//             weather_img.src = "/assets/rain.png";
//             break;
//         case 'Mist':
//             weather_img.src = "/assets/mist.png";
//             break;
//         case 'Snow':
//             weather_img.src = "/assets/snow.png";
//             break;

//     }

//     console.log(weather_data);
// }


// searchBtn.addEventListener('click', ()=>{
//     checkWeather(inputBox.value);
// });
var config = {
    cURL: 'https://api.countrystatecity.in/v1/countries',
    cKey: 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==',
    wURL: 'https://api.openweathermap.org/data/2.5/',
    wKey: '07bdb9ca0babeaa8c4392c2bc0e67fc6'
}

var countrySelect = document.querySelector(".country"),
    stateSelect = document.querySelector(".state"),
    citySelect = document.querySelector(".city"),
    weatherDisplayDiv = document.getElementById("weatherwidget"),
    cardContainer = document.querySelector(".card-container"),
    cardTitle = document.querySelector(".card-title")
    units = document.querySelector(".units")
    let btn = document.querySelector('.button button')

function loadCountries(){
    let apiEndPoint = config.cURL
    fetch(apiEndPoint, {headers: {"X-CSCAPI-KEY": config.cKey}})
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        data.forEach(country => {
            const option = document.createElement('option')
            option.value = country.iso2
            option.textContent = country.name
            countrySelect.appendChild(option)
        })
    })
    .catch(error => console.error('Error loading countries:', error))

    stateSelect.disabled = true
    citySelect.disabled = true 
    stateSelect.style.pointerEvents = "none"
    citySelect.style.pointerEvents = "none"
}


function loadStates(){
    stateSelect.disabled = false
    citySelect.disabled = true
    stateSelect.style.pointerEvents = "auto"
    citySelect.style.pointerEvents = "none"

    const selectedCountryCode = countrySelect.value
    // console.log(selectedCountryCode);
    stateSelect.innerHTML = '<option>Select State</option>'
    citySelect.innerHTML = '<option>Select City</option>'

    fetch(`${config.cURL}/${selectedCountryCode}/states`,{headers: {"X-CSCAPI-KEY": config.cKey}})
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        data.forEach(state => {
            const option = document.createElement('option')
            option.value = state.iso2
            option.textContent = state.name
            stateSelect.appendChild(option)
        })
    })
    .catch(error => console.error('Error loading states:', error))
}

function loadCities(){
    citySelect.disabled = false 
    citySelect.style.pointerEvents = "auto"
    const selectedCountryCode = countrySelect.value
    const selectedStateCode = stateSelect.value 
    // console.log(selectedCountryCode, selectedStateCode);
    citySelect.innerHTML = '<option>Select City</option>'

    fetch(`${config.cURL}/${selectedCountryCode}/states/${selectedStateCode}/cities`,{headers: {"X-CSCAPI-KEY": config.cKey}})
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        data.forEach(city => {
            const option = document.createElement('option')
            option.value = city.name
            option.textContent = city.name
            citySelect.appendChild(option)
        })
    })
    .catch(error => console.error('Error loading cities:', error))
}

citySelect.addEventListener('change', async function() {
    const selectedCity = this.value 
    weatherDisplayDiv.innerHTML = loader()
    const weatherInfo = await getWeather(selectedCity)
    console.log(weatherInfo);
    displayWeatherInfo(weatherInfo)
})

const getWeather = async (cityName, units = "metric") => {
    const apiEndPoint = `${config.wURL}weather?q=${cityName}&appid=${config.wKey}&units=${units}`
    
    const response = await fetch(apiEndPoint)
    if(response.status != 200){
        throw new Error(`Something went wrong, status code: ${response.status}`)
    }

    const weather = await response.json()
    return weather
}

const tempCard = (val, unit="cel") => {
    const flag = unit == "far" ? "°F" : "°C"
    return `<h6 class="card-subtitle mb-2 ${unit}">${val.temp}</h6>
    <p class="card-text"><b>Feels Like:</b> ${val.feels_like} ${flag}</p>
    <p class="card-text"><b>Max_Temp:</b> ${val.temp_max} ${flag}</p>
    <p class="card-text"><b>Min_Temp:</b> ${val.temp_min} ${flag}</p>
    `
}

const getDateTime = (unixTimeStamp) => {
    const milliSeconds = unixTimeStamp * 1000

    const dateObject = new Date(milliSeconds)

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    const dateFormate = dateObject.toLocaleDateString('en-US', options)
    return dateFormate
}

const displayWeatherInfo = (data) => {
    const weatherwidget = `<div class="d-flex justify-content-between card-container">
    <div class="card card1">
        <div class="card-body">
            <h5 class="card-title">${data.name}, ${data.sys.country}</h5>
            <p>${getDateTime(data.dt)}</p>
            <div class="mb-1" id="tempcard">${tempCard(data.main)}</div>
            ${data.weather.map((w) => `<div class="condition-img"><span><b>Main:</b> ${w.main}</span> <img src="https://openweathermap.org/img/wn/${w.icon}.png" alt="" class="iconImg"></div>
            <p><b>Description:</b> ${w.description}</p>
        </div>`)}
    </div>

    <div class="card card2">
        <div class="card-body">
            <p><b>Humidity:</b> ${data.main.humidity}%
                <span class="float-end units"><a href="#" class="unitlink active" data-unit="cel">°C</a><a href="#" class="unitlink" data-unit="far">°F</a></span>
            </p>
            <p><b>Pressure:</b> ${data.main.pressure}</p>
            <p><b>Wind-Speed:</b> ${data.wind.speed} Km/h</p>
            <p><b>Sea_Level:</b> ${data.main.sea_level}</p>
            <p><b>Grnd_Level:</b> ${data.main.grnd_level}</p>
        </div>
    </div>
</div>`

weatherDisplayDiv.innerHTML = weatherwidget

    document.querySelectorAll(".unitlink").forEach((link) => {
        link.addEventListener('click', async (e) => {
            const selectedCity = citySelect.value || data.name // use selected city or device location city

            const unitValue = e.target.getAttribute("data-unit")
            const unitFlag = unitValue === "far" ? "imperial" : "metric"

            try{
                const weatherInfo = await getWeather(selectedCity, unitFlag)
                const weatherTemp = tempCard(weatherInfo.main, unitValue)

                document.querySelector("#tempcard").innerHTML = weatherTemp


                // Activate the selected unit link
                document.querySelectorAll('.unitlink').forEach((link) => {
                    link.classList.remove('active')
                })
                e.target.classList.add("active")
            } catch (error) {
                console.error("Error fetching weather:", error)
            }
        })
    })

}


const loader = () => {
    return `<div class="spinner-grow text-danger" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`
}

window.onload = async function () {
    loadCountries() // load the list of countries

    // Check if geolocation is available in the browser
    if("geolocation" in navigator){
        // get the user's current location
        navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            // Fetch weather information based on the user's location
            try{
                const weatherInfo = await getWeatherByCoordinates(latitude, longitude)
                displayWeatherInfo(weatherInfo)
            } catch (error) {
                console.error("Error featching weather by Coordinates:", error);
            }
        })
    }
    else{
        // Geolocation is not availabel in the browser, handle this case
        console.log("Geolocation is not available in this browser.");
    }
}


async function getWeatherByCoordinates(latitude, longitude, units = "metric"){
    const apiEndPoint = `${config.wURL}weather?lat=${latitude}&lon=${longitude}&appid=${config.wKey}&units=${units}`
    const response = await fetch(apiEndPoint)

    if(response.status !== 200){
        throw new Error (`Something went wrong, status code: ${response.status}`)
    }

    const weather = await response.json()
    return weather
}
