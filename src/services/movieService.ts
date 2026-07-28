import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesResponse {
  results: Movie[];
}

const token = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get<MoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.results;
};
