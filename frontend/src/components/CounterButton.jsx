const CounterButton = ({label, counter = 0}) => {
    const handleClick = async () => {
        console.log('Clicked button');
    }
    
    return (
        <button onClick={handleClick} className="text-brown3 bg-beige px-3 py-1.5 border-2 border-brown3 rounded-md hover:bg-brown3 hover:text-beige">{label} ({counter})</button>
    );
}

export default CounterButton;