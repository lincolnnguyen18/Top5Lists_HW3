import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
/*
    This modal is shown when the user asks to delete a list. Note 
    that before this is shown a list has to be marked for deletion,
    which means its id has to be known so that we can retrieve its
    information and display its name in this modal. If the user presses
    confirm, it will be deleted.
    
    @author McKilla Gorilla
*/
function DeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let listToDelete = store.listToDelete;
    let name = "";
    if (listToDelete && listToDelete.name != null) {
        // console.log(listToDelete);
        name = listToDelete.name;
    }
    function handleDeleteList(e) {
        e.stopPropagation();
        store.deleteList(listToDelete.id);
        handleCloseModal();
    }
    function handleCloseModal(e) {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }
    return (
        <div
            className="modal"
            id="delete-modal"
            data-animation="slideInOutLeft">
            <div className="modal-dialog">
                <header className="dialog-header">
                    Delete the {name} Top 5 List?
                </header>
                <div id="confirm-cancel-container">
                    <button
                        id="dialog-yes-button"
                        className="modal-button"
                        onClick={handleDeleteList}
                    >Confirm</button>
                    <button
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCloseModal();
                        }}
                    >Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;