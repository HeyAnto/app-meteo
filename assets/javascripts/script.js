// Récuperation des variable du html et la clé api

let cityInput = document.getElementById("city_input"),
  searchBtn = document.getElementById("searchBtn"),
  api_key = "6529bbf8a404d9dc7494e5331f646f82",
  cardTitle = document.querySelector(".card-title"),
  cardWeather = document.querySelector(".card-weather");

function getWeatherDetails(name, lat, lon, country, state) {
  let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}&lang=fr`;

  let jours = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  let mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      let jourSemaine = jours[date.getDay()];
      let jour = date.getDate();
      let moisAnnee = mois[date.getMonth()];
      let temperature = Math.round(data.main.temp);
      let description = data.weather[0].description;
      let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      let weatherMain = data.weather[0].main.toLowerCase();

      let weatherBackgrounds = {
        clear: "url('assets/images/clear.webp')",
        clouds: "url('assets/images/cloudy.webp')",
        rain: "url('assets/images/rain.webp')",
        thunderstorm: "url('assets/images/thunder.webp')",
        snow: "url('assets/images/snow.webp')",
        mist: "url('assets/images/mist.webp')",
        haze: "url('assets/images/haze.webp')",
      };
      let backgroundImage =
        weatherBackgrounds[weatherMain] || "url('assets/images/clear.webp')";

      cardTitle.style.backgroundImage = backgroundImage;
      cardTitle.style.backgroundSize = "cover";
      cardTitle.style.backgroundPosition = "center";

      cardTitle.innerHTML = `
        <h2>${name}</h2>
        <p>${state ? state + ", " : ""}${country}</p>
        <p>${jourSemaine} ${jour} ${moisAnnee}</p>
      `;

      cardWeather.innerHTML = `
        <div class="card-weather-content">
          <h2 class="display1">${temperature}°C</h2>
          <p style="text-transform: capitalize;">${description}</p>
        </div>
        <div class="card-weather-img">
          <img src="${icon}" alt="Météo" />
        </div>
      `;
    })
    .catch(() => {
      alert(`Échec de récupération des données météo`);
    });
}

function getCityCoordinates() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;
  let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        alert(`Ville introuvable : ${cityName}`);
        return;
      }
      let { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch(() => {
      alert(`Impossible de récupérer les coordonnées de ${cityName}`);
    });
}

searchBtn.addEventListener("click", getCityCoordinates);

document.addEventListener("DOMContentLoaded", function () {
  getWeatherDetails("Paris", 48.8566, 2.3522, "France", "Île-de-France");
});
