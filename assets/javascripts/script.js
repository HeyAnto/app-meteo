// Déclaration des variables et récupération des éléments principaux (class, id, api)
let cityInput = document.getElementById("city_input"),
  searchBtn = document.getElementById("searchBtn"),
  api_key = "6529bbf8a404d9dc7494e5331f646f82",
  cardTitle = document.querySelector(".card-title"),
  cardWeather = document.querySelector(".card-weather"),
  cardHumidity = document.querySelector(".card-humidity");
cardWind = document.querySelector(".card-wind");

// Declaration des variables pour récuperer les informations de l'API
function getWeatherDetails(name, lat, lon, country, state) {
  // Preparation de la requete meteo
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

  // Envoi de la requête api puis transformation multiple jusqu'a obtenir un format js exploitable
  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      // Insertion des infos de la reponse dans des variables pour une meilleur visiblité dans la card
      let date = new Date();
      let jourSemaine = jours[date.getDay()];
      let jour = date.getDate();
      let moisAnnee = mois[date.getMonth()];
      let temperature = Math.round(data.main.temp);
      let wind = data.wind.speed;
      let humidity = data.main.humidity;
      let description = data.weather[0].description;
      let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      let weatherMain = data.weather[0].main.toLowerCase();
      // Changement du fond de la card selon la méteo
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
      // Affichage des infos récuperer dans la card grace au variable défini
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

      cardWind.innerHTML = `
        <div class="card card-wind">
            <img
              class="icon"
              src="assets/icons/icon-wind.svg"
              alt="Icone Wind"
            />
            <div class="card-mini-content">
              <h2 class="display1">${wind}</h2>
              <p>Wind m/s</p>
            </div>
          </div>
      `;

      cardHumidity.innerHTML = `
      <div class="card card-humidity">
            <img
              class="icon"
              src="assets/icons/icon-humidity.svg"
              alt="Icone Humidity"
            />
            <div class="card-mini-content">
              <h2 class="display1">${humidity}%</h2>
              <p>Humidity</p>
           </div>
          </div>
      `;
    })
    .catch(() => {
      alert(`Échec de récupération des données météo`);
    });
}

// Pour récuperer la longitude et latitude de la recherche selon la ville
function getCityCoordinates() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;
  let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

  // Requete api concernant la localisation
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

// Affichage par défaut
document.addEventListener("DOMContentLoaded", function () {
  getWeatherDetails("Paris", 48.8566, 2.3522, "France", "Île-de-France");
});
