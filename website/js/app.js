const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'f8617bb9fae9a7ec13c0aa7a12f6d85e';

// onclick listener
const submitEntry = (e) => {
    e.preventDefault();

    const zipcode = document.getElementById('zip').value;
    const feeling = document.getElementById('feelings').value;

    // show an error if zip code or feeling is empty
    let err = false
    if (feeling === '') {
        showError('feelings');
        err = true;
    } else {
        hideError('feelings');
    }
    if (zipcode === '') {
        showError('zip');
        err = true;
    } else {
        hideError('zip');
    }

    const errormsg = document.getElementById('error-message');
    if (err) {
        errormsg.classList.toggle('hidden');
        return
    } else {
        errormsg.classList.add('hidden');
    }

    getWeatherData(BASE_URL, API_KEY, zipcode)
    .then(
        function(weatherdata) {
            if (weatherdata != null) {
                const newData = {
                    feeling: feeling,
                    weather: weatherdata,
                    date: new Date().toDateString()
                }
                postJournalEntry('/newEntry', newData)
            }
            
        }
    ).then(
        function() {
            updateUI()
            updateRecent()
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
            iconID: data.weather[0].icon,
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

    const latestEntry = entries.slice(-1)[0];
    document.getElementById('date').innerText = latestEntry.date;
    document.getElementById('feeling').innerText = latestEntry.feeling;
    document.getElementById('temperature').innerText = `${latestEntry.weather.temperature}°F`;
    document.getElementById('location').innerText = `${latestEntry.weather.city}, ${latestEntry.weather.country}`;
    document.getElementById('description').innerText = latestEntry.weather.description;
    document.getElementById('humidity').innerText = `Humidity: ${latestEntry.weather.humidity}%`;
    document.getElementById('wind').innerText = `Wind: ${latestEntry.weather.wind} mph`;
};

const updateRecent = async () => {
    let entries
    try {
        const res = await fetch('/entries');
        entries = await res.json();
    } catch (error) {
        console.log(error);
    }

    const entriesContainer = document.getElementById('recent-entries');
    const journalFragment = new DocumentFragment();

    if (entries.length > 5) {
        entries = entries.slice(1).slice(-5);
    }
    
    entries.forEach((entry) => {
        const card = document.createElement('div');
        card.classList.add('journal-card');

        const date = document.createElement('p');
        date.classList.add('date');
        date.setAttribute('id', 'date');
        date.innerText = entry.date;
        card.appendChild(date);

        const cardcontent = document.createElement('div');
        cardcontent.classList.add('card-content');

        const icon = document.createElement('img');
        icon.setAttribute('src', `http://openweathermap.org/img/w/${entry.weather.iconID}.png`)
        cardcontent.appendChild(icon);

        const feeling = document.createElement('p');
        feeling.classList.add('feeling');
        feeling.setAttribute('id', 'feeling');
        feeling.innerText = entry.feeling;
        cardcontent.appendChild(feeling);

        const temperature = document.createElement('p');
        temperature.classList.add('temperature');
        temperature.setAttribute('id', 'temperature');
        temperature.innerText = `${entry.weather.temperature}°F`;
        cardcontent.appendChild(temperature);

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
        humidity.innerText = `Humidity: ${entry.weather.humidity}%`;
        details.appendChild(humidity);

        const wind = document.createElement('p');
        wind.classList.add('wind');
        wind.setAttribute('id', 'wind');
        wind.innerText = `Wind: ${entry.weather.wind} mph`;
        details.appendChild(wind);

        cardcontent.appendChild(details);
        card.appendChild(cardcontent);
        journalFragment.appendChild(card);
    });

    entriesContainer.innerHTML = '';
    entriesContainer.appendChild(journalFragment);
}

updateRecent();

const showError = (elementID) => {
    const element = document.getElementById(elementID);
    element.setAttribute('style', 'background-color: rgb(255 0 0 / 23%);')
}

const hideError = (elementID) => {
    const element = document.getElementById(elementID);
    element.setAttribute('style', 'background-color: #f4f4f4;')
}