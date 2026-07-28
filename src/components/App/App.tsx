import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import css from "./App.modele.css";

type ModuleWithDefault<T> = {
  default: T;
};

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: Boolean(query),
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (data && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, movies.length]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      {isPending && <Loader />}

      {isError && <ErrorMessage />}

      {!isPending && !isError && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => handlePageChange(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}

export default App;
