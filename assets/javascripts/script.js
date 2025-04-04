// === Déclaration des variables principales ===
let cityInput = document.getElementById("city_input");
let searchBtn = document.getElementById("searchBtn");
let api_key = "6529bbf8a404d9dc7494e5331f646f82";

// === Sélection des éléments de la carte météo ===
let cardTitle = document.querySelector(".card-title");
let cardWeather = document.querySelector(".card-weather");
let cardHumidity = document.querySelector(".card-humidity");
let cardWind = document.querySelector(".card-wind");

// === Fonction pour récupérer les détails météo en fonction des coordonnées ===
function getWeatherDetails(name, lat, lon, country, state) {
  // URL de l'API météo
  let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}&lang=fr`;

  // Tableaux pour convertir les dates en français
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

  // Appel API météo
  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      // Récupération des infos météo
      let date = new Date();
      let jourSemaine = jours[date.getDay()];
      let jour = date.getDate();
      let moisAnnee = mois[date.getMonth()];

      let temperature = Math.round(data.main.temp);
      let wind = data.wind.speed;
      let humidity = data.main.humidity;
      let description = data.weather[0].description;
      let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      let weatherMain = data.weather[0].main.toLowerCase(); // Ex: 'clear', 'clouds', 'rain'

      // Choix du fond d'écran selon la météo
      let weatherBackgrounds = {
        clear: "url('assets/images/clear.webp')",
        clouds: "url('assets/images/cloudy.webp')",
        rain: "url('assets/images/rain.webp')",
        thunderstorm: "url('assets/images/thunder.webp')",
        snow: "url('assets/images/snow.webp')",
        mist: "url('assets/images/mist.webp')",
        haze: "url('assets/images/haze.webp')",
      };

      // Si la météo n’est pas reconnue, on utilise un fond par défaut
      let backgroundImage =
        weatherBackgrounds[weatherMain] || "url('assets/images/clear.webp')";

      // Mise à jour du fond de la card
      cardTitle.style.backgroundImage = backgroundImage;

      // === Mise à jour des éléments de la card ===

      // Titre (ville + pays + date)
      cardTitle.innerHTML = `
        <h2>${name}</h2>
        <p>${state ? state + ", " : ""}${country}</p>
        <p>${jourSemaine} ${jour} ${moisAnnee}</p>
      `;

      // Température et description
      cardWeather.innerHTML = `
        <div class="card-weather-content">
          <h2 class="display1">${temperature}°C</h2>
          <p style="text-transform: capitalize;">${description}</p>
        </div>
        <div class="card-weather-img">
          <img src="${icon}" alt="Météo" />
        </div>
      `;

      // Vent
      cardWind.innerHTML = `
        <div class="card card-wind">
          <img class="icon" src="assets/icons/icon-wind.svg" alt="Icône Vent" />
          <div class="card-mini-content">
            <h2 class="display1">${wind}</h2>
            <p>Vent m/s</p>
          </div>
        </div>
      `;

      // Humidité
      cardHumidity.innerHTML = `
        <div class="card card-humidity">
          <img class="icon" src="assets/icons/icon-humidity.svg" alt="Icône Humidité" />
          <div class="card-mini-content">
            <h2 class="display1">${humidity}%</h2>
            <p>Humidité</p>
          </div>
        </div>
      `;
    })
    .catch(() => {
      alert(`Échec de récupération des données météo.`);
    });
}

// === Fonction pour récupérer les coordonnées d'une ville via OpenWeather Geo API ===
function getCityCoordinates() {
  let cityName = cityInput.value.trim(); // On récupère la valeur de l'input
  cityInput.value = ""; // Réinitialise l'input

  if (!cityName) return; // Si l'input est vide, on ne fait rien

  // URL de l'API de géocodage
  let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        alert(`Ville introuvable : ${cityName}`);
        return;
      }

      // On récupère les infos utiles de la ville
      let { name, lat, lon, country, state } = data[0];

      // Fonction pour récupérer la météo
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch(() => {
      alert(`Impossible de récupérer les coordonnées de ${cityName}`);
    });
}

// === Lancement de la recherche météo quand on clique sur le bouton ===
searchBtn.addEventListener("click", getCityCoordinates);

// === Affichage par défaut à l'ouverture de la page ===
document.addEventListener("DOMContentLoaded", function () {
  // Paris par défaut
  getWeatherDetails("Paris", 48.8566, 2.3522, "France", "Île-de-France");
});
