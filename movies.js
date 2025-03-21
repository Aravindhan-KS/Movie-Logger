let totalTimeWatched = 0;
const actorsArray = [];
const movieTitles = new Set();
let Time = 0;

document
  .getElementById("movie-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const movieName = document.getElementById("movie-input").value.trim();
    if (movieTitles.has(movieName)) {
      alert("Movie already added.");
      return;
    }

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?t=${movieName}&apikey=68d51e0d`
      );
      const data = await response.json();
      if (data.Response === "False") {
        alert("No results found.");
        return;
      }

      if (data.Type === "series") {
        const totalEpisodes = await getTotalEpisodes(data.Title);
        Time = totalEpisodes * parseInt(data.Runtime);
      } else {
        Time = parseInt(data.Runtime);
      }

      totalTimeWatched += +(Time / 60).toFixed(1);
      document.getElementById("time-watched").textContent =
        totalTimeWatched;

      movieTitles.add(movieName);
      const resultsDiv = document.getElementById("results");
      const movieDiv = document.createElement("div");
      movieDiv.classList.add("movieDiv");
      movieDiv.innerHTML = `
                                  <br>
                                  <div class="movie-container">
                                      <h2 class="movie-title">${data.Title}</h2>
                                      <div class="movie-content">
                                          <img class="movie-poster" src="${data.Poster}" alt="${data.Title}">
                                          <ul class="movie-details">
                                              <li><strong>Year:</strong> ${data.Year}</li>
                                              <li><strong>Language:</strong> ${data.Language}</li>
                                              <li><strong>Genre:</strong> ${data.Genre}</li>
                                              <li><strong>Director:</strong> ${data.Director}</li>
                                              <li><strong>Actors:</strong> ${data.Actors}</li>
                                              <li><strong>Plot:</strong> ${data.Plot}</li>
                                              <li><strong>Runtime:</strong> ${Time} minutes</li>
                                              <li><strong>IMDB Rating:</strong> ${data.imdbRating}</li>
                                              <li><strong>Awards:</strong> ${data.Awards}</li>
                                          </ul>
                                      </div>
                                  </div>
                              `;
      resultsDiv.prepend(movieDiv);

      const actors = data.Actors.split(", ");
      actorsArray.push(...actors);
      const mostOccurringActor = getMostOccurringActor(actorsArray);
      document.getElementById(
        "most-occurring-actor"
      ).textContent = `Most Occurring Actor: ${mostOccurringActor}`;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

async function getTotalEpisodes(seriesName) {
  const apiKey = "68d51e0d";
  let totalEpisodes = 0;

  const response = await fetch(
    `https://www.omdbapi.com/?t=${seriesName}&apikey=${apiKey}`
  );
  const data = await response.json();

  const totalSeasons = parseInt(data.totalSeasons);
  for (let season = 1; season <= totalSeasons; season++) {
    const seasonResponse = await fetch(
      `https://www.omdbapi.com/?t=${seriesName}&season=${season}&apikey=${apiKey}`
    );
    const seasonData = await seasonResponse.json();
    totalEpisodes += seasonData.Episodes.length;
  }

  return totalEpisodes;
}

function getMostOccurringActor(actorsArray) {
  const actorCount = {};
  let maxCount = 0;
  let mostOccurringActor = "";

  actorsArray.forEach((actor) => {
    actorCount[actor] = (actorCount[actor] || 0) + 1;
    if (actorCount[actor] > maxCount) {
      maxCount = actorCount[actor];
      mostOccurringActor = actor;
    }
  });

  return mostOccurringActor;
}

function updateActorList() {
  const actorCount = {};
  actorsArray.forEach((actor) => {
    actorCount[actor] = (actorCount[actor] || 0) + 1;
  });

  const sortedActors = Object.entries(actorCount).sort(
    (a, b) => b[1] - a[1]
  );

  const actorList = document.getElementById("actorList");
  actorList.innerHTML = "";
  sortedActors.forEach(([actor, count]) => {
    const li = document.createElement("li");
    li.textContent = `${actor}: ${count} movies`;
    actorList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateActorList();
});