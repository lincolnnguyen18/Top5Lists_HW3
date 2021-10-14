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
                onClick={() => {
                    if (store.canUndo()) {
                        handleUndo();
                    } else {
                        console.log('disabled');
                    }
                }}
                className={`${enabledButtonClass} ${!store.canUndo() ? 'top5-button-disabled' : ''}`}>
                &#x21B6;
            </div>
            <div
                // disabled={true}
                id='redo-button'
                onClick={() => {
                    if (store.canRedo()) {
                        handleRedo();
                    } else {
                        console.log('disabled');
                    }
                }}
                className={`${enabledButtonClass} ${!store.canRedo() ? 'top5-button-disabled' : ''}`}>
                &#x21B7;
            </div>
            <div
                // disabled={store.currentList == null}
                id='close-button'
                onClick={() => {
                    if (store.currentList != null) {
                        handleClose();
                    } else {
                        console.log('disabled');
                    }
                }}
                className={`${enabledButtonClass} ${store.currentList == null ? 'top5-button-disabled' : ''}`}>
                &#x24E7;
            </div>
        </div>
    )
}

export default EditToolbar;