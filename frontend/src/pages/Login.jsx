import React, {useState} from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // need to handleSubmit, make call to login route

    return (
        // add states for email, password (onChange, e.target.name)
        // add a submit handler to make a call to post login route

        // add onSubmit={handleSubmit} when handler is created
        <form>
            <div className="absolute bottom-0 left-0 bg-lime size-full p-0 mx-auto">
                <div className='bg-dark w-8/12 h-4/6 mx-auto rounded-xl'>
                    <div className="mt-10 grid grid-cols-1 gap-y-6 justify-items-center">
                        <h2 className="text-lime text-center mt-20">Register</h2>
                        <label htmlFor="email" className="text-lime">
                            Email
                            <input type="text" name="email" id="email" className="block rounded-md" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </label>
                        <label htmlFor="password" className="text-lime">
                            Password
                            <input type="text" name="password" id="password" className="block rounded-md" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </label>
                    </div>
                    <button type="submit" className="bg-lime rounded-md text-dark">Login</button>
                </div>
            </div>
        </form>
    );
}

export default Login