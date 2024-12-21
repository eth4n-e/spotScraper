import axios from 'axios';

const AddCounterButton = ({handleClick, itemIds=[], disabled}) => { 
    return (
        <button onClick={handleClick} className={disabled ? "hidden" : "text-brown3 bg-beige px-3 py-1.5 border-2 border-brown3 rounded-md hover:bg-brown3 hover:text-beige"}>Add ({itemIds.length})</button>
    );
}

export default AddCounterButton;