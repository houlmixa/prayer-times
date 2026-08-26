const cities = [
  { name: "Agadir", lat: 30.4278, lng: -9.5981 },
  { name: "Kenitra", lat: 34.2541, lng: -6.5890 },
  { name: "Rabat", lat: 34.0209, lng: -6.8416 },
  { name: "Tetouan", lat: 35.5785, lng: -5.3684 }
];

async function fetchPrayerTimes() {
  try {
    // 1. Create an array of fetch promises
    const fetchPromises = cities.map(city => 
      fetch(`https://api.aladhan.com/v1/timings?latitude=${city.lat}&longitude=${city.lng}&method=21`)
        .then(res => res.json())
        .then(data => ({
          cityName: city.name,
          timings: data.data.timings
        }))
    );

    // 2. Fire them all at once and wait
    const results = await Promise.all(fetchPromises);

    // 3. Inject them into your HTML cards
    results.forEach(result => {
      console.log(`--- ${result.cityName} ---`);
      console.log(`Fajr: ${result.timings.Fajr}`);
      console.log(`Sunrise: ${result.timings.Sunrise}`);
      console.log(`Last Third: ${result.timings.Lastthird}`);
          
      results.forEach(result => {
        const card = document.getElementById(result.cityName);
        if (!card) return; // Failsafe if you misspelled an ID

        // Update the specific spans inside that card
        card.querySelector('.val-fajr').innerText = result.timings.Fajr;
        card.querySelector('.val-sunrise').innerText = result.timings.Sunrise;
        card.querySelector('.val-lastthird').innerText = result.timings.Lastthird;
      });
    });

  } catch (error) {
    console.error("Failed to fetch prayer times:", error);
    // Always have a fallback UI state if the API goes down
  }
}

fetchPrayerTimes();
