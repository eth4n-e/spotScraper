const Register = () => {
    return (
        <form>
            <div className="absolute bottom-0 left-0 bg-lime w-screen h-screen p-0 mx-auto">
                <div className='bg-dark w-10/12 h-5/6 mx-auto rounded-xl'>
                    <div className='bg-dark opacity-80 w-5/6 h-4/6 mx-auto rounded-xl shadow-md'>
                        <h2 className="text-lime text-center mt-4">Register</h2> 
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <label htmlFor="email" className="text-lime">
                                Email
                                <input type="text" name="email" id="email" className="block rounded-md">
                                </input>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Register