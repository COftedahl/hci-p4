import IMovie from "../Types/IMovie";
import ALL_MOVIES_JSON from "./MOCK_MOVIE_DATA";

const allMovies: IMovie[] = ALL_MOVIES_JSON.map(({title, genre, description, release_date}: {title: string, genre: string, description: string, release_date: string}) => 
{
  return {
    title: title.replace(", The", "").replace(", A", ""), 
    genre: genre.split("|")[0], 
    description: description, 
    releaseDate: release_date,
  }
})

export const allGenres: string[] = Array.from(new Set(allMovies.map((movie: IMovie) => movie.genre)));
export const allGenreMovies: IMovie[][] = allGenres.map((genre: string) => {
  return (
    allMovies.filter((movie: IMovie) => movie.genre === genre)
  )
});

export default allMovies;