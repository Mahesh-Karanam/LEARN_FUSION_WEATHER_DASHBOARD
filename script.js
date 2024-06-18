document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'c4eea9726790a9c1709c2e32b13f141c';
    const city = prompt("Enter city name") ;
    document.getElementById("city").innerHTML = city;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const fetchWeather = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const { coord } = data; 
            updateMapCenter(coord.lat, coord.lon);
            displayWeather(data);
            
        } catch (error) {
            console.error('Error fetching current weather:', error);
        }
    };

    const updateMapCenter = (lat, lon) => {
        map.setView([lat, lon], 10); // Set map view to city coordinates with zoom level 10
    };

    const fetchForecast = async () => {
        try {
            const response = await fetch(forecastUrl);
            const data = await response.json();
            displayForecast(data);
        } catch (error) {
            console.error('Error fetching forecast:', error);
        }
    };

    const displayWeather = (data) => {
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.innerHTML = `
            <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
            <p><strong>Description:</strong> ${data.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        `;
    };

    const displayForecast = (data) => {
        const forecastInfo = document.getElementById('forecast-info');
        forecastInfo.innerHTML = '';
        const forecasts = data.list.filter((item, index) => index % 8 === 0); // Take one forecast per day
        forecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temp = forecast.main.temp;
            const description = forecast.weather[0].description;
            forecastInfo.innerHTML += `
                <div class="forecast-item">
                    <p><strong>${day}:</strong> ${temp}°C, ${description}</p>
                </div>
            `;
        });
    };

    const map = L.map('mapid').setView([51.505, -0.09], 10); // London coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    fetchWeather();
    fetchForecast();
});
