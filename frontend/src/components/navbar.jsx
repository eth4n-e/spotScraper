// link will be used for page navigation
import { Link, useLocation } from 'react-router-dom'
import DeleteCounterButton from './DeleteCounterButton';
import AddCounterButton from './AddCounterButton';
import axios from 'axios';
// return navbar template
// remember curly braces inside parentheses, destructing, reading data contained within the object
const NavBar = ({ user, idList, setClickedTracks, setTracks }) => {
    // using location to handle knowing which page we are currently on
        // compare the path to the href
    const location = useLocation();
    const TRACK_ENDPOINT = 'https://api.spotify.com/v1/me/tracks';

    const handleAddFromPlaylist = () => {
        // use the idList to fetch items from each playlist, add this to a local variable list
        // use this local list to make the request to spotify for adding these tracks
    }
    
    const handleAddFromTopTracks = async () => {
        // can immediately make the request to add songs
        try {
            const adjustTrackEndpoint = TRACK_ENDPOINT + `?ids=${idList}`;

            await axios({
                method: 'put',
                url: adjustTrackEndpoint,
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            // no need for setTracks here because navigating to liked songs will cause re-render
            // remove every track that was in the list
            setClickedTracks(idList.filter(id => !idList.includes(id)))
        } catch(err) {
            console.error(err);
        }
    }

    const handleDeleteFromLiked = async  () => {
        try {
            const adjustTrackEndpoint = TRACK_ENDPOINT + `?ids=${idList}`;

            await axios.delete(adjustTrackEndpoint, {
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            // remove tracks from liked songs
            setTracks(prevList => {
                let updatedTrackList = [];
                
                updatedTrackList = prevList.filter(track => !idList.includes(track.id));

                return updatedTrackList;
            })
            // remove every track that was in the list
            setClickedTracks(idList.filter(id => !idList.includes(id)))
        } catch(err) {
            console.error(err);
        }
    }

    const navigation = [
        {name: 'Liked Songs', href:'/likedsongs'},
        {name: 'Top Tracks', href:'/toptracks'},
        {name: 'Playlists', href:'/playlists'}
    ]

    return (
        <nav className="w-screen h-fit sticky bg-beige border-b border-brown3 top-0 z-40 py-4">
            <ul className="w-screen flex items-center gap-x-6">
                <li className="ml-4 flex items-center gap-x-6">
                    {navigation.map( (item) => (
                        
                            <Link 
                                to={item.href}
                                key={item.name}
                                aria-current={ location.pathname === item.href ? 'page' : undefined }
                                className={ `${location.pathname === item.href ? 'bg-brown3 text-beige border-2 border-brown3' : 'bg-beige text-brown3 border-2 border-brown3 hover:bg-brown3 hover:text-beige'} rounded-md px-3 py-2 text-sm font-medium`}
                            >
                                {item.name}
                            </Link>
                        
                    ))}
                </li>
                <li className="shrink">
                    <label htmlFor="search" className="mr-2 text-brown3 font-medium">Search</label>
                    <input id="search" className="text-brown3 bg-beige px-3 py-1.5 border-2 border-brown3 rounded-md focus:outline-none" type="text"/>
                </li>
                <li>
                    {location.pathname === '/likedsongs' ? (
                        <DeleteCounterButton idList={idList} handleClick={handleDeleteFromLiked} disabled={idList.length === 0}/>
                    ) : (
                        location.pathname === '/playlists' ? 
                            (<AddCounterButton idList={idList} handleClick={handleAddFromPlaylist} disabled={idList.length === 0}/>) : 
                            (<AddCounterButton idList={idList} handleClick={handleAddFromTopTracks} disabled={idList.length === 0}/>)
                    )}
                </li>
                <li>
                    {location.pathname === '/likedsongs' ? (
                        <button className="text-brown3 bg-beige px-3 py-1.5 border-2 border-brown3 rounded-md hover:bg-brown3 hover:text-beige">Delete All</button>
                    ) : (
                        <button className="text-brown3 bg-beige px-3 py-1.5 border-2 border-brown3 rounded-md hover:bg-brown3 hover:text-beige">Add All</button>
                    )}
                </li>
                <li className="grow">
                    <img
                        alt="Profile Pic"
                        src={user.profilePic}
                        className="h-11 w-auto rounded-md border-solid border border-beige"
                    />
                </li>
            </ul>
        </nav>
)}

export default NavBar;