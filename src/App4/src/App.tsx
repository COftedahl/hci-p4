import Dashboard from "./Dashboard";
import { allGenreMovies } from '../data/allMovies';
import IMovie from "Types/IMovie";
import './App.css';
import './all.css';
import PopupMovieInfo from "./PopupMovieInfo";
import EditGenreScreen from "./EditGenreScreen";
import { saveLogs } from "./logSaver";

interface AppProps {

}

const App: React.FC<AppProps> = (props: AppProps) => {

  const {genres, setGenres}: {genres: () => IMovie[][], setGenres: (newData: IMovie[][]) => void} = (props as any).useState("genres", allGenreMovies);
  const {showPopup, setShowPopup}: {showPopup: () => boolean, setShowPopup: (val: boolean) => void} = (props as any).useState("showPopup", false);
  const {popupMovieIndex, setPopupMovieIndex} = (props as any).useState("popupMovieIndex", -1);
  const {popupMovieGenreIndex, setPopupMovieGenreIndex} = (props as any).useState("popupMovieGenreIndex", 0);
  const {tab, setTab} = (props as any).useState("tab", 0);

  (props as any).log(JSON.stringify(genres()));

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
    <div className="App borderBox fullHeight fullWidth" id="app">
      {tab() === 0 ? 
        <div className="fullHeight fullWidth">
          <div className="fullHeight fullWidth">
            <PopupMovieInfo showPopup={showPopup()} closePopup={handleClosePopup} movieInfo={(popupMovieIndex() >= 0 && popupMovieIndex() < genres().length ? genres()[popupMovieGenreIndex()][popupMovieIndex()] : {title: "", genre: "", description: "", releaseDate: ""})}/>
            <Dashboard moviesByGenre={genres()} openPopup={handleShowPopup} handleEditClicked={handleEditClicked}/>
          </div>
          <div className="fullHeight fullWidth hidden">
            <EditGenreScreen 
              movies={genres()[popupMovieGenreIndex()]} 
              setMovies={(newMovies: IMovie[]) => {
                const oldGenres = genres();
                oldGenres.splice(popupMovieGenreIndex(), 1, newMovies)
                setGenres(oldGenres);
              }}
              closeScreen={() => setTab(0)}
            />
          </div>
        </div>
      :
        ""
      }
      {tab() === 1 ? 
        <div className="fullHeight fullWidth">
          <div className="fullHeight fullWidth hidden">
            <PopupMovieInfo showPopup={showPopup()} closePopup={handleClosePopup} movieInfo={(popupMovieIndex() >= 0 && popupMovieIndex() < genres().length ? genres()[popupMovieGenreIndex()][popupMovieIndex()] : {title: "", genre: "", description: "", releaseDate: ""})}/>
            <Dashboard moviesByGenre={genres()} openPopup={handleShowPopup} handleEditClicked={handleEditClicked}/>
          </div>
          <div className="fullHeight fullWidth">
            <EditGenreScreen 
              movies={genres()[popupMovieGenreIndex()]} 
              setMovies={(newMovies: IMovie[]) => {
                const oldGenres = genres();
                oldGenres.splice(popupMovieGenreIndex(), 1, newMovies)
                setGenres(oldGenres);
              }}
              closeScreen={() => setTab(0)}
            />
          </div>
        </div>
      :
        ""
      }
      <div className="flexRow centerAlign centerJustify">
        <button type="button" className="button" onClick={saveLogs}>
          Save Session Log
        </button>
      </div>
    </div>
  );
}

export default App;