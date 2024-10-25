import ClickedCard from "./ClickedCard";

const TrackCard = ({track, handleCardClick, isClicked}) => {
    return (
        <>
            {isClicked ? (
                <ClickedCard handleCardClick={handleCardClick} id={track.id}/>
            ) : (
                <div onClick={() => handleCardClick(track.id)} className="overflow-x-auto rounded-md p-2 bg-beige2 shadow-inner shadow-brown2 transition ease-in-out duration-500 hover:-translate-y-1 hover:bg-beige1 hover:shadow-2xl hover:shadow-brown1 hover:border hover:border-brown1" key={track.id}>
                    <img className="object-cover rounded-md drop-shadow-xl " src={track.album.images[0].url} alt="Track cover"/>
                    <p className="text-center mt-2 text-brown3 font-semibold">{track.name} by {track.artists[0].name}</p>
                </div>  
            )}
         </>
    );
}

export default TrackCard;