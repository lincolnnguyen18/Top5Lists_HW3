import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "top5-button";
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    // let editStatus = false;
    // if () {
    //     editStatus = true;
    // }
    return (
        <div id="edit-toolbar">
            <div
                // disabled={true}
                id='undo-button'
                onClick={handleUndo}
                className={`${enabledButtonClass} ${!store.canUndo() || store.isListNameEditActive ? 'top5-button-disabled' : ''}`}>
                &#x21B6;
            </div>
            <div
                // disabled={true}
                id='redo-button'
                onClick={handleRedo}
                className={`${enabledButtonClass} ${!store.canRedo() || store.isListNameEditActive ? 'top5-button-disabled' : ''}`}>
                &#x21B7;
            </div>
            <div
                // disabled={store.currentList == null}
                id='close-button'
                onClick={handleClose}
                className={`${enabledButtonClass} ${store.currentList == null || store.isListNameEditActive ? 'top5-button-disabled' : ''}`}>
                &#x24E7;
            </div>
        </div>
    )
}

export default EditToolbar;