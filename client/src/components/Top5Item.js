import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDraggedTo] = useState(0);

    function handleDragStart(event) {
        event.dataTransfer.setData("item", event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveItemTransaction(sourceId, targetId);
    }

    let { index } = props;
    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }

    let itemDiv =
    <div
        id={'item-' + (index + 1)}
        className={itemClass}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        draggable="true"
    >
        <input
            disabled={store.isListNameEditActive}
            type="button"
            id={"edit-item-" + index + 1}
            className={`list-card-button ${store.isListNameEditActive ? 'disabled' : ''}`}
            value={"\u270E"}
            onClick={(e) => {
                e.preventDefault();
                store.setListNameEditActive(true);
                // console.log(e.currentTarget.parentElement);
                // console.log(e.currentTarget.parentElement.innerText);
                let item = e.currentTarget.parentElement;
                // store.setRenameItemIndex(item.id.substring(item.id.indexOf("-") + 1));
                e.currentTarget.parentElement.innerHTML = `<input type='text' id='textbox' value='${item.innerText}' />`;
            }}
        />
        {props.text}
    </div>;

    return (
        itemDiv
    );
}

export default Top5Item;