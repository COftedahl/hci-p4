import IMovie from "Types/IMovie";
import './EditGenreScreen.css';

interface EditGenreScreenProps {
  movies: IMovie[], 
  setMovies: (newMovies: IMovie[]) => void, 
  closeScreen: () => void, 
}

const EditGenreScreen: React.FC<EditGenreScreenProps> = (props: EditGenreScreenProps) => {

  const handleMoveDownClicked = (oldIndex: number) => {
    if (oldIndex > 0) {
      let oldMovies: IMovie[] = props.movies;
      (props as any).log("Movie list before removing movie being moved: ", JSON.stringify(oldMovies));
      const removingMovie: IMovie = oldMovies[oldIndex];
      (props as any).log("Moving ", JSON.stringify(removingMovie));
      oldMovies = oldMovies.splice(oldIndex, 1);
      (props as any).log("Movie list after removing movie being moved: ", JSON.stringify(oldMovies));
      oldMovies.splice(oldIndex - 1, 0, removingMovie);
      props.setMovies(oldMovies);
      (props as any).log(JSON.stringify(oldMovies));
    }
  }

  const handleMoveUpClicked = (oldIndex: number) => {
    if (oldIndex < props.movies.length - 1) {
      let oldMovies: IMovie[] = props.movies;
      (props as any).log("Movie list before removing movie being moved: ", JSON.stringify(oldMovies));
      const removingMovie: IMovie = oldMovies[oldIndex];
      (props as any).log("Moving ", JSON.stringify(removingMovie));
      oldMovies = oldMovies.splice(oldIndex, 1);
      (props as any).log("Movie list after removing movie being moved: ", JSON.stringify(oldMovies));
      oldMovies.splice(oldIndex + 1, 0, removingMovie);
      props.setMovies(oldMovies);
      (props as any).log(JSON.stringify(oldMovies));
    }
  }

  return (
    <div className="EditGenreScreen flexCol fullWidth" id="EditScreen">
      <p className="EditGenreScreen_TitlePar headerText padding05">
        {props.movies[0].genre}
      </p>
      <div className="EditGenreScreen_ItemsDivWrapper borderBox fullWidth padding1">
        <div className="EditGenreScreen_ItemsDiv borderBox flexRow carousel gap1 fullWidth">
          {props.movies.map((movie: IMovie, index: number) => {
            return (
              <div className="EditGenreScreen_Items_Item borderThin flexColumn padding1 flexColumn centerAlign spaceBetweenJustify textAlignMiddle" key={index}>
                {movie.title}
                <div className="EditGenreScreen_Items_Item_ButtonsDiv fullWidth flexRow spaceBetweenJustify bottomAlign padding05 borderBox">
                  <button className="EditGenreScreen_Items_Item_Buttons_Button EditGenreScreen_Items_Item_Buttons_Prev button" type="button" onClick={() => handleMoveDownClicked(index)}>
                    &lt;
                  </button>
                  <button className="EditGenreScreen_Items_Item_Buttons_Button EditGenreScreen_Items_Item_Buttons_Next button" type="button" onClick={() => handleMoveUpClicked(index)}>
                    &gt;
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="EditGenreScreen_BackButtonDiv flexRow centerJustify centerAlign fullWidth padding1 borderBox">
        <button className="EditGenreScreen_BackButton button" type="button" onClick={props.closeScreen}>
          Close
        </button>
      </div>
    </div>
  );
}

export default EditGenreScreen;