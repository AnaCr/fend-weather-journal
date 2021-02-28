const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'f8617bb9fae9a7ec13c0aa7a12f6d85e';

// onclick listener
const submitEntry = () => {
    const zipcode = document.getElementById('zip').value;
    getWeatherData(BASE_URL, API_KEY, zipcode)
    .then(
        function(weatherdata) {
            updateUI(weatherdata);
        }
    )
}

document.getElementById('submit').addEventListener('click', submitEntry)

const getWeatherData = async (baseURL, apiKey, zipcode) => {
    
    const url = `${baseURL}?zip=${zipcode},us&units=imperial&appid=${apiKey}`;
    const res = await fetch(url);

    try {
        const data = await res.json();
        console.log(data);

        let weatherData = {
            city: data.name,
            country: data.sys.country,
            temperature: data.main.temp,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            wind: data.wind.speed,

        }
        return weatherData;
    } catch (error) {
        console.log(error);
    }
}

const updateUI = (weather) => {
    document.getElementById('weather-data').innerText = `${weather.city}, ${weather.country}
    ${weather.description}
    temperature: ${weather.temperature} °F
    humidity: ${weather.humidity}
    wind: ${weather.wind} mph
    `;
}