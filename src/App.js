import { useState } from "react";
import NavBar from "./components/NavBar";
import Main from "./components/Main";
import Loader from "./components/Loader";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading } = useMovies(query, handleCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.id !== id));
  }

  // useEffect(function () {
  //   async function fetchMovies() {
  //     setIsLoading(true);
  //     const res = await fetch(
  //       `https://api.themoviedb.org/3/movie/now_playing?api_key=2c03a557e1479b7b37ea2b20a7672f3e&language=en-US&page=1`
  //     );
  //     const data = await res.json();
  //     console.log(data);
  //     setMovies(data.results);
  //     setIsLoading(false);
  //   }
  //   fetchMovies();
  // }, []);

  return (
    <>
      <NavBar movies={movies} fetchMovie={(query) => setQuery(query)} />
      {isLoading ? (
        <Loader />
      ) : (
        <Main
          movies={movies}
          watched={watched}
          selectedId={selectedId}
          handleCloseMovie={handleCloseMovie}
          handleAddWatched={handleAddWatched}
          handleDeleteWatched={handleDeleteWatched}
          handleSelectMovie={(id) =>
            setSelectedId((selectedId) => (id === selectedId ? null : id))
          }
        />
      )}
    </>
  );
}
