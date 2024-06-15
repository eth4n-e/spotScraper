import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpotify} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';


const Auth = () => {
    return (
        <form>
            <div className="absolute bottom-0 left-0 bg-beige size-full p-0 mx-auto">
                <div className='relative top-1/4 bg-brown3 backdrop-saturate-2 shadow-inner drop-shadow-xl w-8/12 h-3/6 mx-auto rounded-xl text-center'>
                    <header className="bg-beige drop-shadow-xl rounded-t-xl">
                        <h1 className='py-6 font-bold text-xl text-brown3'>Authorize Via Spotify</h1>
                    </header>
                    <Link to="/login">
                        <FontAwesomeIcon icon={faSpotify} beat size="8x" className='mt-20 text-beige' />
                    </Link>
                </div>
            </div>
        </form>
    );
}

export default Auth