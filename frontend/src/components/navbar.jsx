// link will be used for page navigation
import { Link, useLocation } from 'react-router-dom'
// return navbar template
// remember curly braces inside parentheses, destructing, reading data contained within the object
const Navbar = ({ profilePic }) => {
    // using location to handle knowing which page we are currently on
        // compare the path to the href
    const location = useLocation();

    const navigation = [
        {name: 'Liked Songs', href:'/likedsongs'},
        {name: 'Top Tracks', href:'/toptracks'},
        {name: 'Playlists', href:'/playlists'}
    ]

    return (
        <div className="bg-beige border-b border-brown1">
            <div className="mx-auto px-2 max-w-7xl sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between"> 
                    <div className="flex flex-1 items-center justify-evenly">
                        <div>
                            <div className="flex space-x-12 md:-ml-4">
                                {navigation.map( (item) => (
                                    <Link 
                                        to={item.href}
                                        key={item.name}
                                        aria-current={ location.pathname === item.href ? 'page' : undefined }
                                        className={ `${location.pathname === item.href ? 'bg-brown3 text-beige shadow-2xl outline outline-2 outline-offset-2 outline-brown3' : 'bg-beige text-brown3 outline outline-2 outline-offset-2 outline-brown3 hover:bg-brown3 hover:text-beige hover:outline-0 hover:shadow-2xl'} rounded-md px-3 py-2 text-sm font-medium`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="search" className="mr-2 text-brown3 font-medium">Search</label>
                            <input id="search" className="text-brown3 bg-beige px-3 py-2 border-2 border-brown3 rounded-md focus:outline-none" type="text"/>
                        </div>
                        <div className="flex items-center justify-center sm:items-stretch">
                            <img
                                alt="Profile Pic"
                                src={profilePic}
                                className="h-10 w-auto rounded-md border-solid border border-beige"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>   
)}

export default Navbar