const DeleteCounterButton = ({handleClick, idList=[]}) => {
    // wanting to pass handleClick as a parameter because the behavior of the click depends on which page it was clicked from
    return (
        <button onClick={handleClick} className="text-brown3 bg-beige px-3 py-1.5 border-2 border-brown3 rounded-md hover:bg-brown3 hover:text-beige">Delete ({idList.length})</button>
    );
}

export default DeleteCounterButton;