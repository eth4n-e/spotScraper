// import { useState } from "react";
import ClickedCard from "./ClickedCard"

const PlaylistCard = ({playlist, handleCardClick, isClicked}) => {
    return (
        <>
            {isClicked ? (
                <ClickedCard id={playlist.id} handleCardClick={handleCardClick}/>
            ) : (
                <div onClick={() => handleCardClick(playlist.id)} className="rounded-md p-2 bg-beige2 shadow-inner shadow-brown2 transition ease-in-out duration-500 hover:-translate-y-1 hover:bg-beige1 hover:shadow-2xl hover:shadow-brown1 hover:border hover:border-brown1" key={playlist.id}>
                    <img className="mx-auto w-11/12 h-20 sm:h-32 md:h-48 lg:h-64 xl:h-96 rounded-md drop-shadow-xl" src={playlist.images[0].url} alt="Playlist cover"/>
                    <p className="mt-2 text-center text-brown3 font-semibold">{playlist.name}</p>
                    <p className="mt-2 text-center text-brown3 font-semibold">{playlist.tracks.total} tracks</p>
                </div> 
            )}
        </>
    );
}

export default PlaylistCard;