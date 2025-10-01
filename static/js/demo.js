async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const url = `https://wttr.in/${city}?format=2`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    document.getElementById("weatherResult").textContent = text;
  } catch (error) {
    document.getElementById("weatherResult").textContent = "Error fetching weather data.";
  }
}


