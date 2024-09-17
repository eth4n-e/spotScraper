import Navbar from "../components/navbar"
import { useLoaderData } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

const TopTracks = () => {
    const user = useLoaderData();
    const [topTracks, setTopTracks] = useState([]);

    useEffect( () => {
        const fetchTopTracks = async (user) => {
            
            const trackResponse = await axios.post('/api/music/fetchTopTracks', {
                user
            });

            console.log(trackResponse);

            const trackObjects = trackResponse.data.tracks.items;

            setTopTracks(trackObjects);
        }
        fetchTopTracks(user);

    }, [user]);

    return (
        <div className="w-100 bg-beige">
            <Navbar profilePic={user.profilePic}/>
            <div className='mt-4 pb-4 mx-4 grid grid-cols-4 gap-6'>
                {
                    topTracks && (topTracks.map( (track) => (
                    <div className="rounded-md p-2 bg-beige2 shadow-inner shadow-brown2 hover:shadow-2xl hover:shadow-brown1 hover:border hover:border-brown1" key={track.id}>
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