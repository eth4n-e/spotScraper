import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpotify} from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

// should pass in a user possibly
    // response from call to authorization endpoint should be stored
    // and used to update the current user's information
const Auth = () => {

    const handleAuth = async () => {
        try {
            // to receive from callback:
                // access_token
                // token_type
                // scope
                // expires_in
                // refresh_token
            // maybe make a separate model for tokens
                // User can have a token document
            // from response make a post request to update user information
            // const response = await fetch('/api/music/login');
            const response = await axios.get('/api/music/login');
            console.log(response);
        } catch(err) {
            console.log(err);
        }   
    }

    return (
        <form>
            <div className="absolute bottom-0 left-0 bg-beige size-full p-0 mx-auto">
                <div className='relative top-1/4 bg-brown3 backdrop-saturate-2 shadow-inner drop-shadow-xl w-8/12 h-3/6 mx-auto rounded-xl text-center'>
                    <header className="bg-beige drop-shadow-xl rounded-t-xl">
                        <h1 className='py-6 font-bold text-xl text-brown3'>Authorize Via Spotify</h1>
                    </header>
                    <FontAwesomeIcon icon={faSpotify} size="8x" className='mt-20 text-beige' onClick={() => handleAuth()}/>
                </div>
            </div>
        </form>
    );
}

export default Auth