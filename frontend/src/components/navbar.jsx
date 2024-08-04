// link will be used for page navigation
import { Link } from 'react-router-dom'
// return navbar template
const Navbar = (profilePic) => {

    const navigation = [
        {name: 'Liked Songs', href:'#', current: true },
        {name: 'Top Tracks', href:'/toptracks', current: false},
        {name: 'Playlists', href:'/playlists', current: false}
    ]


    return (
        <div className="bg-brown3">
            <div className="mx-auto px-2">
                <div className="relative flex h-16 items-center justify-between"> 
                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex flex-shrink-0 items-center">
                            <img
                                alt="Profile Pic"
                                src={profilePic}
                                className="h-8 w-auto"
                            />
                        </div>
                        <div className="hidden">
                            <div className="flex space-x-4">
                                {navigation.map( (item) => (
                                    <a 
                                        href={item.href}
                                        key={item.name}
                                        aria-current={ item.current ? 'page' : undefined }
                                        className={ `${item.current ? 'bg-brown1 text-beige' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-3 text-sm font-medium`}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>   
)}

export default Navbar