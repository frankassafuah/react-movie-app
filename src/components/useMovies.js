import { useEffect, useState } from "react";
export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      // callback?.();
      const controller = new AbortController();
      async function fetchMovie() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=37ed43a4f8eaa2abd75f9283692947bc&language=en-US&page=1&query=${query}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setMovies(data.results);
          setIsLoading(false);
        } catch (error) {
          console.error(error.message);
        }
      }
      if (query.length < 3) return;
      fetchMovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return {
    isLoading,
    movies,
  };
}
