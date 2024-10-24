// link will be used for page navigation
import { Link, useLocation } from 'react-router-dom'
import CounterButton from './CounterButton';
// return navbar template
// remember curly braces inside parentheses, destructing, reading data contained within the object
const NavBar = ({ profilePic, buttonType, counter }) => {
    // using location to handle knowing which page we are currently on
        // compare the path to the href
    const location = useLocation();

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
                    <CounterButton label={buttonType} counter={counter}/>
                </li>
                <li className="grow">
                    <img
                        alt="Profile Pic"
                        src={profilePic}
                        className="h-11 w-auto rounded-md border-solid border border-beige"
                    />
                </li>
            </ul>
        </nav>
)}

export default NavBar;