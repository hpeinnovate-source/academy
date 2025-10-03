function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultBox = document.getElementById("weatherResult");

  if (!city) {
    resultBox.textContent = "Please enter a city name.";
    return;
  }

  const url = `https://wttr.in/${city}?format=3`; // Simple one-line format

  fetch(url)
    .then(response => response.text())
    .then(data => {
      resultBox.textContent = data;
    })
    .catch(error => {
      resultBox.textContent = "Error fetching weather data.";
      console.error(error);
    });
}
