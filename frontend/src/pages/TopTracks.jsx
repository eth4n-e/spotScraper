import NavBar from "../components/NavBar";
import { useLoaderData } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

const TopTracks = () => {
    const user = useLoaderData();
    const [topTracks, setTopTracks] = useState([]);
    const [counter, setCounter] = useState(0);
    const [clickedTracks, setClickedTracks] = useState([]);

    useEffect( () => {
        const fetchTopTracks = async (user) => {
            
            const trackResponse = await axios.post('/api/music/fetchTopTracks', {
                user
            });

            // use set to remove duplicates
            const uniqueTracks = new Set(trackResponse.data.tracks);

            // convert back to array to make use of map functionality to transform the data into renderable components
            const tracks = Array.from(uniqueTracks);

            setTopTracks(tracks);
        }
        fetchTopTracks(user);
    }, [user]);

    const handleCardClick = (id) => {
        // have to update list in a state setter for React to handle properly
        setClickedTracks(prevList => {
            let updatedTrackList = [];

            if (prevList.indexOf(id) === -1) { // track not present in list
                updatedTrackList = [...prevList, id];
            } else {
                // create new array without element that was clicked
                updatedTrackList = prevList.filter(trackId => trackId !== id);
            }
            setCounter(updatedTrackList.length);

            return updatedTrackList;
        });
    }

    return (
        <div className="w-100 bg-beige">
            <NavBar profilePic={user.profilePic} buttonType={"Add"} counter={counter}/>
            <div className='mt-4 pb-4 mx-4 grid grid-cols-4 gap-6'>
                {
                    topTracks && (topTracks.map( (track) => (
                        <div onClick={() => handleCardClick(track.id)} className="rounded-md p-2 bg-beige2 shadow-inner shadow-brown2 transition ease-in-out duration-500 hover:-translate-y-1 hover:bg-beige1 hover:shadow-2xl hover:shadow-brown1 hover:border hover:border-brown1" key={track.id}>
                            <img className="object-cover rounded-md drop-shadow-xl " src={track.album.images[0].url} alt="Playlist cover"/>
                            <p className="mt-2 text-brown3 font-semibold">{track.name} by {track.artists[0].name}</p>
                        </div>  
                    )))
                }
            </div>
        </div>
    )
}

export default TopTracks