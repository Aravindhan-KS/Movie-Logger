import { getMostOccurringActor, actorsArray } from "./movies.js";

document.addEventListener("DOMContentLoaded", () => {
  const mostOccurringActor = getMostOccurringActor(actorsArray);
  document.getElementById(
    "most-occurring-actor"
  ).textContent = `Most Occurring Actor: ${mostOccurringActor}`;
});
setTimeout(() => {
  if (typeof movies === "undefined") {
    console.error("Movies data is not loaded.");
    return;
  }

  const actorCount = {};
  movies.forEach((movie) => {
    movie.actors.forEach((actor) => {
      actorCount[actor] = (actorCount[actor] || 0) + 1;
    });
  });

  const sortedActors = Object.entries(actorCount).sort((a, b) => b[1] - a[1]);

  const actorList = document.getElementById("actorList");
  sortedActors.forEach(([actor, count]) => {
    const li = document.createElement("li");
    li.textContent = `${actor}: ${count} movies`;
    actorList.appendChild(li);
  });
}, 500);

