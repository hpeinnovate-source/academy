async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const resultDiv = document.getElementById("weatherResult");

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    const { main, weather, wind, sys, name } = data;
    const description = weather[0].description;
    const temp = main.temp;
    const feelsLike = main.feels_like;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const country = sys.country;

    resultDiv.innerHTML = `
      <h2>${name}, ${country}</h2>
      <p><strong>${description.toUpperCase()}</strong></p>
      <p>🌡️ Temperature: ${temp}°C (Feels like ${feelsLike}°C)</p>
      <p>💧 Humidity: ${humidity}%</p>
      <p>🌬️ Wind Speed: ${windSpeed} m/s</p>
    `;

    resultDiv.classList.remove("hidden");

    // Change background gradient based on weather
    changeBackground(weather[0].main.toLowerCase());

  } catch (error) {
    resultDiv.innerHTML = `<p style="color:white;">${error.message}</p>`;
    resultDiv.classList.remove("hidden");
  }
}

function changeBackground(condition) {
  let gradient;

  switch (condition) {
    case "clear":
      gradient = "linear-gradient(135deg, #f6d365, #fda085)";
      break;
    case "clouds":
      gradient = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      break;
    case "rain":
      gradient = "linear-gradient(135deg, #00c6fb, #005bea)";
      break;
    case "thunderstorm":
      gradient = "linear-gradient(135deg, #141e30, #243b55)";
      break;
    case "snow":
      gradient = "linear-gradient(135deg, #e6dada, #274046)";
      break;
    case "mist":
    case "fog":
      gradient = "linear-gradient(135deg, #606c88, #3f4c6b)";
      break;
    default:
      gradient = "linear-gradient(135deg, #89f7fe, #66a6ff)";
  }

  document.body.style.background = gradient;
}
