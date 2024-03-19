import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function Main({
  movies,
  watched,
  handleSelectMovie,
  selectedId,
  handleCloseMovie,
}) {
  return (
    <main className="main">
      <ListBox movies={movies} handleSelectMovie={handleSelectMovie} />
      <WatchedBox
        watched={watched}
        selectedId={selectedId}
        handleCloseMovie={handleCloseMovie}
      />
    </main>
  );
}

function ListBox({ movies, handleSelectMovie }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && (
        <MovieList movies={movies} handleSelectMovie={handleSelectMovie} />
      )}
    </div>
  );
}

function MovieList({ movies, handleSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.id}
          handleSelectMovie={handleSelectMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectMovie }) {
  return (
    <li onClick={() => handleSelectMovie(movie.id)}>
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.release_date}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedBox({ watched, selectedId, handleCloseMovie }) {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {selectedId ? (
        <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} />
      ) : (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMovieList watched={watched} />
        </>
      )}
    </div>
  );
}

function MovieDetails({ selectedId, onCloseMovie }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${selectedId}?api_key=37ed43a4f8eaa2abd75f9283692947bc&language=en-US`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={`Poster of ${movie.title} movie`}
            />
            <div className="details-overview">
              <h2>{movie.title}</h2>
              <p>
                {movie.release_date} &bull; {movie.runtime}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {movie.genres?.map((g, i) => (
                  <p key={i}>{g.name},</p>
                ))}
              </div>
              <p>
                <span>⭐️</span>
                {Math.round(movie.vote_average)} rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating maxRating={10} size={24} />
            </div>
            <p>
              <em>{movie.overview}</em>
            </p>
            <p>Starring</p>
            <p>Directed by </p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.id} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
