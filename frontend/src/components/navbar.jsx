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
        <div className="bg-brown3">
            <div className="mx-auto px-2 max-w-7xl sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between"> 
                    <div className="flex flex-1 items-center justify-between">
                        <div>
                            <div className="flex space-x-6 md:-ml-4">
                                {navigation.map( (item) => (
                                    <Link 
                                        to={item.href}
                                        key={item.name}
                                        aria-current={ location.pathname === item.href ? 'page' : undefined }
                                        className={ `${location.pathname === item.href ? 'bg-beige text-brown2 shadow-2xl' : 'text-beige hover:bg-brown2 hover:text-beige hover:shadow-2xl'} rounded-md px-3 py-2 text-sm font-medium`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center justify-center sm:items-stretch">
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