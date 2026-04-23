import IMovie from "Types/IMovie";
import './PopupMovieInfo.css'

interface PopupMovieInfoProps {
  showPopup: boolean, 
  closePopup: () => void, 
  movieInfo: IMovie, 
}

const PopupMovieInfo: React.FC<PopupMovieInfoProps> = (props: PopupMovieInfoProps) => {

  return (
    <div className={"PopupMovieInfoBackground modalBackground flexColumn centerAlign centerJustify" + (props.showPopup ? "" : " modalBackground-hidden")} onClick={props.closePopup}>
      <div className="PopupMovieInfoCard card modalPopup popup modal flexColumn centerAlign spaceBetweenJustify width40">
        <p className="PopupMovieInfo_Title headerText">
          {props.movieInfo && props.movieInfo.title ? props.movieInfo.title : "Invalid value for movie title retrieved"}
        </p>
        <hr className="PopupMovieInfoCard_Divider divider"/>
        <p>{props.movieInfo && props.movieInfo.genre ? "Genre: " + props.movieInfo.genre : "Invalid value for genre retrieved"}</p>
        <p>{props.movieInfo && props.movieInfo.releaseDate ? "Released: " + props.movieInfo.releaseDate : "Invalid value for release date retrieved"}</p>
        <br/>
        <p>{props.movieInfo && props.movieInfo.description ? props.movieInfo.description : "Invalid value for description retrieved"}</p>
      </div>
    </div>
  );
}

export default PopupMovieInfo;