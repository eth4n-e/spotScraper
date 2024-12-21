const ClickedPlaylistCard = ({playlist, handleCardClick}) => {
    return (
        <div onClick={() => handleCardClick(playlist.id)} className="rounded-md p-2 shadow-lg shadow-brown3 bg-brown1 transition ease-in-out duration-500 hover:-translate-y-1 hover:shadow-md hover:shadow-brown2">
            <img className="mx-auto w-11/12 h-20 sm:h-32 md:h-48 lg:h-64 xl:h-96 rounded-md drop-shadow-xl" src={playlist.images[0].url} alt="Playlist cover"/>
            <p className="mt-2 text-center text-beige2 font-semibold">{playlist.name}</p>
            <p className="mt-2 text-center text-beige2 font-semibold">{playlist.tracks.total} tracks</p>
        </div> 
    );
}

export default ClickedPlaylistCard;