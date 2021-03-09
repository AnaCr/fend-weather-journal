const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'f8617bb9fae9a7ec13c0aa7a12f6d85e';

// onclick listener
const submitEntry = () => {
    const zipcode = document.getElementById('zip').value;
    const feeling = document.getElementById('feelings').value;

    getWeatherData(BASE_URL, API_KEY, zipcode)
    .then(
        function(weatherdata) {
            const newData = {
                feeling: feeling,
                weather: weatherdata,
                date: new Date().toDateString()
            }
            postJournalEntry('/newEntry', newData)
        }
    ).then(
        function() {
            updateUI()
        }
    );
}

document.getElementById('generate').addEventListener('click', submitEntry)

const postJournalEntry = async (url, data) => {
    try {
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const msg = await res.json();
        return msg;
    }catch(error){
        console.log(error);
    }
}

const getWeatherData = async (baseURL, apiKey, zipcode) => {
    const url = `${baseURL}?zip=${zipcode},us&units=imperial&appid=`;

    try {
        const res = await fetch(url + apiKey);
        const data = await res.json();

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

const updateUI = async () => {
    let entries
    try {
        const res = await fetch('/entries');
        entries = await res.json();
    } catch (error) {
        console.log(error);
    }

    const entriesContainer = document.getElementById('journal-entries');
    const journalFragment = new DocumentFragment();
    entries.forEach((entry)=> {
        console.log(entry);
        const card = document.createElement('div');
        card.classList.add('journal-card');

        const date = document.createElement('p');
        date.classList.add('date');
        date.setAttribute('id', 'date');
        date.innerText = entry.date;
        card.appendChild(date);

        const feeling = document.createElement('p');
        feeling.classList.add('feeling');
        feeling.setAttribute('id', 'feeling');
        feeling.innerText = entry.feeling;
        card.appendChild(feeling);

        const temperature = document.createElement('p');
        temperature.classList.add('temperature');
        temperature.setAttribute('id', 'temperature');
        temperature.innerText = `${entry.weather.temperature}°F`;
        card.appendChild(temperature);

        const details = document.createElement('div');
        details.classList.add('details');
        details.setAttribute('id', 'details');

        const location = document.createElement('p');
        location.classList.add('location');
        location.setAttribute('id', 'location');
        location.innerText = `${entry.weather.city}, ${entry.weather.country}`;
        details.appendChild(location);

        const description = document.createElement('p');
        description.classList.add('description');
        description.setAttribute('id', 'description');
        description.innerText = entry.weather.description;
        details.appendChild(description);

        const humidity = document.createElement('p');
        humidity.classList.add('humidity');
        humidity.setAttribute('id', 'humidity');
        humidity.innerText = `Humidity: ${entry.weather.humidity}`;
        details.appendChild(humidity);

        const wind = document.createElement('p');
        wind.classList.add('wind');
        wind.setAttribute('id', 'wind');
        wind.innerText = `Wind: ${entry.weather.wind} mph`;
        details.appendChild(wind);

        card.appendChild(details);
        journalFragment.appendChild(card);
    });

    entriesContainer.innerHTML = '';
    entriesContainer.appendChild(journalFragment);
};