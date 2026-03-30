import Dashboard from "./Dashboard";
import { allGenreMovies } from '../data/allMovies';
import IMovie from "Types/IMovie";
import './App.css';
import PopupMovieInfo from "./PopupMovieInfo";
import EditGenreScreen from "./EditGenreScreen";

interface AppProps {

}

const App: React.FC<AppProps> = (props: AppProps) => {

  const {genres, setGenres}: {genres: () => IMovie[][], setGenres: (newData: IMovie[][]) => void} = (props as any).useState("genres", allGenreMovies);
  const {showPopup, setShowPopup}: {showPopup: () => boolean, setShowPopup: (val: boolean) => void} = (props as any).useState("showPopup", false);
  const {popupMovieIndex, setPopupMovieIndex} = (props as any).useState("popupMovieIndex", -1);
  const {popupMovieGenreIndex, setPopupMovieGenreIndex} = (props as any).useState("popupMovieGenreIndex", -1);
  const {tab, setTab} = (props as any).useState("tab", 0);

  const handleShowPopup = (movieIndex: number, genreIndex: number) => {
    setPopupMovieGenreIndex(genreIndex);
    setPopupMovieIndex(movieIndex);
    setShowPopup(true);
  }

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupMovieIndex(-1);
  }

  const handleEditClicked = (genreIndex: number) => {
    setPopupMovieGenreIndex(genreIndex);
    setTab(1);
  }

  return (
    <div className="App borderBox fullHeight fullWidth">
      {tab() === 0 ? 
        <div className="fullHeight fullWidth">
          <PopupMovieInfo showPopup={showPopup()} closePopup={handleClosePopup} movieInfo={(popupMovieIndex() >= 0 && popupMovieIndex() < genres().length ? genres()[popupMovieGenreIndex()][popupMovieIndex()] : {title: "", genre: "", description: "", releaseDate: ""})}/>
          <Dashboard moviesByGenre={genres()} openPopup={handleShowPopup} handleEditClicked={handleEditClicked}/>
        </div>
      :
        ""
      }
      {tab() === 1 ? 
        <EditGenreScreen 
          movies={genres()[popupMovieGenreIndex()]} 
          setMovies={(newMovies: IMovie[]) => {
            const oldGenres = genres();
            oldGenres.splice(popupMovieGenreIndex(), 1, newMovies)
            setGenres(oldGenres);
          }}
          closeScreen={() => setTab(0)}
        />
      :
        ""
      }
    </div>
  );
}

export default App;