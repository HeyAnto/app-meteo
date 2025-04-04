// Récuperation des variable du html et la clé api

let cityInput = document.getElementById("city_input"),
  searchBtn = document.getElementById("searchBtn"),
  api_key = "6529bbf8a404d9dc7494e5331f646f82",
  currentWeatherCard = document.querySelectorAll(".weather-left .card")[0];

// Recupere des infos sur l'api et ajoute le jour et mois

function getWeatherDetails(name, lat, lon, country, state) {
  let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key},`;
  let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  (days = [
    `Sunday`,
    `Monday`,
    `Thuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
  ]),
    (months = [
      `Jan`,
      `Feb`,
      `Mar`,
      `Apr`,
      `May`,
      `Jun`,
      `Jul`,
      `Aug`,
      `Oct`,
      `Sep`,
      `Nov`,
      `Dec`,
    ]);

  // Affichage des infos via une requete dans une card pour les visualiser

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      currentWeatherCard.innerHTML = `
        <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>___&deg;C</h2>
                    <p>_____</p>
                </div>
                <div class="weather-icon">
                    img src="https://openweathermap.org/img/wn/04d@2x.png"
                    alt="">
                </div>
        </div>
        <hr>
        <div class="card-footer">
            <p><i class="fa-light fa-calendar"></i>_____</p>
            <p><i class="fa-light fa-location-dot"></i>____</p>
        </div>`;
    })
    .catch(() => {
      alert(`Failed to fetch curent weather`);
    });
}

// Récuperer la gealocalisation de la ville rensiegner dans la barre de recherche

function getCityCoordinates() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;
  let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
  console.log(GEOCODING_API_URL);

  // Envoi de la requete à l'api puis converti la reponse en json

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch(() => {
      alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

searchBtn.addEventListener("click", getCityCoordinates);
