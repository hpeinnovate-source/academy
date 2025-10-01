async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const url = `https://wttr.in/${city}?format=2`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    document.getElementById("weatherResult").textContent = text;

    // Update background map to the entered city (satellite view)
    const mapFrame = document.getElementById("mapFrame");
    if (mapFrame && city && city.trim().length > 0) {
      const query = encodeURIComponent(city.trim());
      const mapUrl = `https://maps.google.com/maps?q=${query}&t=k&z=11&ie=UTF8&iwloc=&output=embed`;
      mapFrame.src = mapUrl;
    }
  } catch (error) {
    document.getElementById("weatherResult").textContent = "Error fetching weather data.";
  }
}


