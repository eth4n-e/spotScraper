const PlaylistCard = ({playlist, handleCardClick}) => {
    return (
        <div onClick={() => handleCardClick(playlist.id)} className="rounded-md p-2 bg-beige2 shadow-lg shadow-brown3 transition ease-in-out duration-500 hover:-translate-y-1 hover:bg-beige1 hover:shadow-md hover:shadow-brown2 hover:border hover:border-brown1" key={playlist.id}>
            <img className="mx-auto w-11/12 h-20 sm:h-32 md:h-48 lg:h-64 xl:h-96 rounded-md drop-shadow-xl" src={playlist.images[0].url} alt="Playlist cover"/>
            <p className="mt-2 text-center text-brown3 font-semibold">{playlist.name}</p>
            <p className="mt-2 text-center text-brown3 font-semibold">{playlist.tracks.total} tracks</p>
        </div> 
    );
}

export default PlaylistCard;