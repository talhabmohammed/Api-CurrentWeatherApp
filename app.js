const element = (e) => document.querySelector(e);

const loader = element("#loading");
let skeletons = document.querySelectorAll(".skeleton");

function displayLoading() {
  loader.classList.add("display");

  setTimeout(() => {
    loader.classList.remove("display");
  }, 15000);

  for (const skeleton of skeletons) {
    skeleton.innerHTML = "";
    skeleton.classList.add("skeleton-loader");
  }
}

function hideLoading() {
  loader.classList.remove("display");

  for (const skeleton of skeletons) {
    skeleton.classList.remove("skeleton-loader");
  }
}

function showError(message) {
  const status = document.getElementById("status");
  status.style.opacity = ".7";
  status.innerHTML = `<i class='fa fa-exclamation-circle'></i>   ${message}`;
  setTimeout(() => (status.style.opacity = "0"), 4000);
}

function refreshAnimate() {
  const details = document.querySelectorAll(".details > div");
  let e = 1;
  for (let i = 0; i < details.length; i++) {
    details[i].style.opacity = "0.1";
    setTimeout(() => (details[i].style.opacity = "1"), 100 * e);
    e += 1.5;
  }
}

let weather = {
  apiKey: "359f0831c53fa20ed2ff23f00ae0904e",

  fetchWeather: function (city, lat, lon) {
    displayLoading();

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&lat=${lat}&lon=${lon}&appid=${this.apiKey}`
    )
      .then((response) => response.json())
      .then((data) => this.displayWeather(data))
      .catch((error) => this.handleErrors(error));
  },

  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const {
      temp,
      temp_min,
      temp_max,
      feels_like,
      humidity,
      pressure,
    } = data.main;
    const { speed } = data.wind;
    const { country } = data.sys;

    element("#city").innerText = name;
    element("#temp").innerText = `${Math.floor(temp)}°F`;
    element(
      "#w-icon"
    ).innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@4x.png" alt="weather-icon">`;
    element("#feels-like").innerText = feels_like + " °F";
    element("#country").innerText = country;
    element("#humidity").innerText = humidity + "%";
    element("#wind").innerText = speed + " km/h";
    element("#pressure").innerText = pressure;
    element("#temp-min").innerText = temp_min + "°F";
    element("#temp-max").innerText = temp_max + "°F";
    element("#description").innerText = description;

    hideLoading();
    refreshAnimate();
  },

  search: function () {
    this.fetchWeather(element(".search-bar").value);
  },

  getUserLocation: function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.fetchWeather("", latitude, longitude);
        },
        (err) => {
          console.error(err);
          showError("can't get current location");
          this.fetchWeather("Isfahan");
        },
        { timeout: 15000 }
      );
    } else {
      showError("Your browser doesn't support geolocation!");
    }
  },

  handleErrors: function (error) {
    hideLoading();

    element(
      "#country"
    ).innerHTML = `<img class="error-img" src="./img/error.png">`;

    if (!navigator.onLine) {
      showError("you are offline");
    } else if (element(".search-bar").value == "") {
      showError("search bar is empty");
    } else {
      showError("can't get data");
    }
  },
};

element(".search button").onclick = () => weather.search();

element(".search-bar").onkeyup = (event) => {
  if (event.key === "Enter") weather.search();
};

//get user location
weather.getUserLocation();
