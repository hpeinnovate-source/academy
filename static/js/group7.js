let map;

function suggestLocations(query) {
  if (query.length < 3) return;
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("suggestions-list");
      list.innerHTML = "";
      data.forEach(place => {
        const li = document.createElement("li");
        li.textContent = place.display_name;
        li.onclick = () => {
          document.getElementById("manual-location").value = place.display_name;
          list.innerHTML = "";
          getWeather(place.display_name);
        };
        list.appendChild(li);
      });
    });
}

async function getWeather(location) {
  const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const current = data.current_condition[0];

    const tempF = current.temp_F;
    const desc = current.weatherDesc[0].value;
    const feelsLikeF = current.FeelsLikeF;
    const humidity = current.humidity;
    const wind = current.windspeedMiles;
    const windDir = current.winddir16Point;

    document.getElementById("weather-info").innerHTML = `
      <div class="weather-card">
        <h2>Weather in ${location}</h2>
        <div class="weather-main">
          <img src="https://wttr.in/${encodeURIComponent(location)}.png" alt="Weather Icon" />
          <div>
            <p class="temp">${tempF}°F</p>
            <p class="desc">${desc}</p>
          </div>
        </div>
        <div class="weather-details">
          <p>Feels like: ${feelsLikeF}°F</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind: ${wind} mph ${windDir}</p>
        </div>
      </div>
    `;

    updateBackground(desc);
    suggestActivities(location);
    centerMap(location);
  } catch (err) {
    document.getElementById("weather-info").innerHTML = `<p>Error fetching weather data.</p>`;
  }
}

function suggestActivities(location) {
  const mapQuery = encodeURIComponent(`things to do near ${location}`);
  const mapLink = `https://www.google.com/maps/search/${mapQuery}`;
  document.getElementById("suggestions").innerHTML = `
    <h3>Nearby Suggestions</h3>
    <p>Explore <a href="${mapLink}" target="_blank">activities near ${location}</a>.</p>
  `;
}

async function centerMap(location) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
  const data = await res.json();
  if (data.length > 0) {
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);

    if (!map) {
      map = L.map('map').setView([lat, lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
    } else {
      map.setView([lat, lon], 13);
    }

    L.marker([lat, lon]).addTo(map).bindPopup(location).openPopup();
  }
}

function updateBackground(desc) {
  const mapEl = document.getElementById("map");
  if (desc.toLowerCase().includes("rain")) {
    mapEl.style.filter = "blur(4px) brightness(0.4)";
    document.body.style.backgroundColor = "#4a4a4a";
  } else if (desc.toLowerCase().includes("clear") || desc.toLowerCase().includes("sunny")) {
    mapEl.style.filter = "blur(4px) brightness(1)";
    document.body.style.backgroundColor = "#87ceeb";
  } else if (desc.toLowerCase().includes("snow")) {
    mapEl.style.filter = "blur(4px) brightness(0.9)";
    document.body.style.backgroundColor = "#f0f8ff";
  } else {
    mapEl.style.filter = "blur(4px) brightness(0.6)";
    document.body.style.backgroundColor = "#888";
  }
}
