import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store'
// import { DeleteModal } from '.';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ editActive, setEditActive ] = useState(false);
    const [ text, setText ] = useState("");
    store.history = useHistory();
    const { idNamePair, selected } = props;

    function handleLoadList(event) {
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(_id);
        }
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if (text.length > 0) {
                let id = event.target.id.substring("list-".length);
                // store.changeListName(id, text);
            }
            store.setListNameEditActive(false);
            setEditActive(false);
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value );
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = store.isListNameEditActive;
    let cardElement =
        <div
            id={idNamePair._id}
            key={idNamePair._id}
            // disabled={store.isListNameEditActive}
            onClick={(e) => {
                if (!editActive) {
                    handleLoadList(e);
                }
                // console.log(store.isListNameEditActive);
            }}
            className={`${'list-card ' + selectClass} ${store.isListNameEditActive ? 'disabledPure' : ''}`}>
            <span
                id={"list-card-text-" + idNamePair._id}
                key={"span-" + idNamePair._id}
                className="list-card-text">
                {idNamePair.name}
            </span>
            <input
                disabled={cardStatus}
                type="button"
                id={"delete-list-" + idNamePair._id}
                className="list-card-button"
                value={"\u2715"}
                onClick={(e) => {
                    e.stopPropagation();
                    let id = e.target.id.substring("delete-list-".length);
                    let listName = e.target.parentElement.firstChild.innerText;
                    let modal = document.getElementById("delete-modal");
                    store.setListToDelete(listName, id);
                    modal.classList.add("is-visible");
                }}
            />
            <input
                disabled={cardStatus}
                type="button"
                id={"edit-list-" + idNamePair._id}
                className="list-card-button"
                onClick={(e) => {
                    e.stopPropagation();
                    store.setIsListNameEditActive();
                    store.setListNameEditActive(true);
                    setEditActive(true);
                }}
                value={"\u270E"}
            />
        </div>;

    if (editActive) {
        cardElement =
            <input
                id={"list-" + idNamePair._id}
                className='list-card'
                type='text'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
            />;
    }
    return (
        cardElement
    );
}

export default ListCard;