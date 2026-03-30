import IMovie from "Types/IMovie";
import './Dashboard.css';

interface DashboardProps {
  moviesByGenre: IMovie[][], 
  openPopup: (movieIndex: number, genreIndex: number) => void, 
  handleEditClicked: (genreIndex: number) => void, 
}

const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {

  return (
    <div className="Dashboard flexColumn fullWidth fullHeight gap1 overflowAuto">
      {props.moviesByGenre.map((movies: IMovie[], index: number) => {
        return (
          <div className="Dashboard_GenreDiv flexCol fullWidth" key={index}>
            <div className="Dashboard_GenreTitleDiv flexRow centerAlign centerJustify gap05 padding05">
              <p className="Dashboard_GenreTitle_TitlePar headerText">
                {movies[0].genre}
              </p>
              <button type="button" className="Dashboard_GenreTitle_EditButton button" onClick={() => props.handleEditClicked(index)}>
                Edit
              </button>
            </div>
            <div className="Dashboard_Genre_ItemsDivWrapper borderBox fullWidth padding1">
              <div className="Dashboard_Genre_ItemsDiv borderBox flexRow carousel gap1 fullWidth">
                {movies.map((movie: IMovie, innerIndex: number) => {
                  return (
                    <div className="Dashboard_Genre_Items_Item borderThin padding1 cursorPointer flexColumn centerAlign topJustify textAlignMiddle" key={innerIndex} onClick={() => props.openPopup(innerIndex, index)}>
                      {movie.title}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default Dashboard;