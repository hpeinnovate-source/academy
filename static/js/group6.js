async function getWeather() {
  const location = document.getElementById("locationInput").value;
  const resultDiv = document.getElementById("weatherResult");

  if (!location) {
    resultDiv.innerHTML = "<p>Please enter a location.</p>";
    return;
  }
  
  function resetWeather() {
  document.getElementById("locationInput").value = "";
  document.getElementById("weatherResult").innerHTML = "";
}


  try {
    const response = await fetch(`https://wttr.in/${location}?format=j1`);
    const data = await response.json();

    const current = data.current_condition[0];
    const weatherHtml = `
      <h2>${location}</h2>
      <p><strong>Temperature:</strong> ${current.temp_C}°C</p>
      <p><strong>Feels Like:</strong> ${current.FeelsLikeC}°C</p>
      <p><strong>Condition:</strong> ${current.weatherDesc[0].value}</p>
      <p><strong>Humidity:</strong> ${current.humidity}%</p>
      <p><strong>Wind:</strong> ${current.windspeedKmph} km/h</p>
      <canvas id="weatherChart" width="300" height="200"></canvas>
    `;

    resultDiv.innerHTML = weatherHtml;
    drawWeatherChart(data.weather);
  } catch (error) {
    resultDiv.innerHTML = "<p>Could not fetch weather data. Try again later.</p>";
    console.error(error);
  }
}

function drawWeatherChart(weatherData) {
  const labels = weatherData.map(day => day.date);
  const temps = weatherData.map(day => parseFloat(day.avgtempC));

  const ctx = document.getElementById("weatherChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Avg Temp (°C)",
        data: temps,
        borderColor: "#4a90e2",
        backgroundColor: "rgba(74,144,226,0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

