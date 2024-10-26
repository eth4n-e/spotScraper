import axios from 'axios';

const AddCounterButton = ({handleClick, idList=[]}) => { 
    return (
        <button onClick={handleClick} className="text-brown3 bg-beige px-3 py-1.5 border-2 border-brown3 rounded-md hover:bg-brown3 hover:text-beige">Add ({idList.length})</button>
    );
}

export default AddCounterButton;