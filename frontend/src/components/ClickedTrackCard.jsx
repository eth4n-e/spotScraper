import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {faSpotify} from '@fortawesome/free-brands-svg-icons';

const ClickedTrackCard = ({track, handleCardClick}) => {

    return (
        <div onClick={() => handleCardClick(track.id)} className="overflow-x-hidden rounded-md p-2 shadow-lg shadow-brown3 bg-brown1 transition ease-in-out duration-500 hover:-translate-y-1 hover:shadow-md hover:shadow-brown2">
            <img className="object-cover rounded-md drop-shadow-xl " src={track.album.images[0].url} alt="Track cover"/>
            <p className="text-center mt-2 text-beige2 font-semibold">{track.name} by {track.artists[0].name}</p> 
        </div>
    );
}

export default ClickedTrackCard;