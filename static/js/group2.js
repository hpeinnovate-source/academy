let lastWeatherData = null; // store last fetched data

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const url = `https://wttr.in/${city}?format=j1`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    lastWeatherData = data; // save for unit switching
    renderWeather();

  } catch (error) {
    resultDiv.innerHTML = `<p style="color:white;">${error.message}</p>`;
    resultDiv.classList.remove("hidden");
  }
}

function renderWeather() {
  if (!lastWeatherData) return;

  const unit = document.getElementById("unitSelect").value;
  const resultDiv = document.getElementById("weatherResult");

  const current = lastWeatherData.current_condition[0];
  const area = lastWeatherData.nearest_area[0].areaName[0].value;
  const country = lastWeatherData.nearest_area[0].country[0].value;

  const description = current.weatherDesc[0].value;
  let tempC = parseFloat(current.temp_C);
  let feelsC = parseFloat(current.FeelsLikeC);
  let windKmph = parseFloat(current.windspeedKmph);
  const humidity = current.humidity;

  // Convert if imperial selected
  let temp, feelsLike, windSpeed, tempUnit, windUnit;
  if (unit === "imperial") {
    temp = cToF(tempC);
    feelsLike = cToF(feelsC);
    windSpeed = kmhToMph(windKmph);
    tempUnit = "°F";
    windUnit = "mph";
  } else {
    temp = tempC;
    feelsLike = feelsC;
    windSpeed = windKmph;
    tempUnit = "°C";
    windUnit = "km/h";
  }

  resultDiv.innerHTML = `
    <h2>${area}, ${country}</h2>
    <p><strong>${description.toUpperCase()}</strong></p>
    <p>🌡️ Temperature: ${temp}${tempUnit} (Feels like ${feelsLike}${tempUnit})</p>
    <p>💧 Humidity: ${humidity}%</p>
    <p>🌬️ Wind Speed: ${windSpeed} ${windUnit}</p>
  `;

  resultDiv.classList.remove("hidden");

  // Change background gradient based on weather description
  changeBackground(description.toLowerCase());
}

function cToF(c) {
  return Math.round((c * 9/5) + 32);
}

function kmhToMph(kmh) {
  return Math.round(kmh / 1.609);
}

function changeBackground(condition) {
  let gradient;

  if (condition.includes("sun") || condition.includes("clear")) {
    gradient = "linear-gradient(135deg, #f6d365, #fda085)";
  } else if (condition.includes("cloud")) {
    gradient = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
  } else if (condition.includes("rain")) {
    gradient = "linear-gradient(135deg, #00c6fb, #005bea)";
  } else if (condition.includes("thunder")) {
    gradient = "linear-gradient(135deg, #141e30, #243b55)";
  } else if (condition.includes("snow")) {
    gradient = "linear-gradient(135deg, #e6dada, #274046)";
  } else if (condition.includes("fog") || condition.includes("mist")) {
    gradient = "linear-gradient(135deg, #606c88, #3f4c6b)";
  } else {
    gradient = "linear-gradient(135deg, #89f7fe, #66a6ff)";
  }

  document.body.style.background = gradient;
}

// Auto-update when unit dropdown changes
document.getElementById("unitSelect").addEventListener("change", renderWeather);
