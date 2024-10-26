import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {faSpotify} from '@fortawesome/free-brands-svg-icons';

const ClickedCard = ({id, handleCardClick}) => {
    return (
        <div onClick={() => handleCardClick(id)} className="rounded-md p-2 bg-brown3">
            <div className="flex h-full justify-center items-center">
                <FontAwesomeIcon icon={faSpotify} className="mb-4 text-5xl md:text-7xl xl:text-9xl text-beige bg-brown3 rounded-3xl"/>
            </div>
        </div>
    );
}

export default ClickedCard;