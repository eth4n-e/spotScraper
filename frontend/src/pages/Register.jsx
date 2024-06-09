const Register = () => {
    return (
        <form>
            <div className="absolute bottom-0 left-0 bg-lime size-full p-0 mx-auto">
                <div className='bg-dark w-8/12 h-4/6 mx-auto rounded-xl'>
                    <div className="mt-10 grid grid-cols-1 gap-y-6 justify-items-center">
                        <h2 className="text-lime text-center mt-20">Register</h2>
                        <label htmlFor="email" className="text-lime">
                            Email
                            <input type="text" name="email" id="email" className="block rounded-md">
                            </input>
                        </label>
                        <label htmlFor="password" className="text-lime">
                            Password
                            <input type="text" name="password" id="password" className="block rounded-md">
                            </input>
                        </label>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Register