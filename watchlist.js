const movieSearchInput = document.getElementById("movieSearch");
const searchBtn = document.getElementById("searchBtn");
const movieList = document.getElementById("movieList");
const watchlist = document.getElementById("watchlist");

let watchlistData = [];

function searchMovie(title) {
  fetch(`https://www.omdbapi.com/?t=${title}&apikey=68d51e0d`)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === "True") {
        displayMovies([data]);
      } else {
        movieList.innerHTML =
          "<p>No movies found. Try another search.</p>";
      }
    })
    .catch((err) => console.error("Error fetching data:", err));
}

function displayMovies(movies) {
  movieList.innerHTML = "";
  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");

    const movieHTML = `
<img src="${
  movie.Poster !== "N/A"
    ? movie.Poster
    : "https://via.placeholder.com/200x300"
}" alt="${movie.Title}" />
<h3>${movie.Title}</h3>
<p>${movie.Year}</p>
<button class="add-to-watchlist" onclick="addToWatchlist('${
  movie.imdbID
}', '${movie.Title}', '${movie.Poster}')">Add to Watchlist</button>
`;

    movieDiv.innerHTML = movieHTML;
    movieList.appendChild(movieDiv);
  });
}

function addToWatchlist(id, title, poster) {
  const existingMovie = watchlistData.find(
    (movie) => movie.imdbID === id
  );
  if (!existingMovie) {
    watchlistData.push({ imdbID: id, Title: title, Poster: poster });

    const watchlistItem = document.createElement("div");
    watchlistItem.classList.add("movie");
    watchlistItem.innerHTML = `
<img src="${poster}" alt="${title}" />
<h3>${title}</h3>
<button class="remove-from-watchlist" onclick="removeFromWatchlist(this, '${id}')">Remove</button>
`;
    watchlist.appendChild(watchlistItem);
  } else {
    alert("This movie is already in your watchlist.");
  }
}

function removeFromWatchlist(button, id) {
  watchlistData = watchlistData.filter((movie) => movie.imdbID !== id);

  button.parentElement.remove();
}

searchBtn.addEventListener("click", () => {
  const movieTitle = movieSearchInput.value.trim();
  if (movieTitle) {
    searchMovie(movieTitle);
    movieSearchInput.value = "";
  }
});