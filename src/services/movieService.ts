import axios from "axios";

import type { Movie } from "../types/movie";

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

const token = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
