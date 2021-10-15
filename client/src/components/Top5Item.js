import { React, useContext, useState } from "react";
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store'
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ editActive, setEditActive ] = useState(false);
    const [ text, setText ] = useState("");
    const [draggedTo, setDraggedTo] = useState(0);
    store.history = useHistory();

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

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if (text.length > 0) {
                // let id = event.target.id.substring("list-".length);
                // store.changeListName(id, text);
                console.log(`newText: ${text}`)
            }
            store.setListNameEditActive(false);
            setEditActive(false);
            // toggleEdit();
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value );
    }

    let { index } = props;
    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }

    let cardStatus = store.isListNameEditActive;

    let cardElement = 
    <>
        <input
            disabled={cardStatus}
            type="button"
            id={"edit-item-" + index + 1}
            className='list-card-button'
            onClick={(e) => {
                e.stopPropagation();
                store.setIsListNameEditActive();
                store.setListNameEditActive(true);
                setEditActive(true);
            }}
            value={"\u270E"}
            />
        {props.text}
    </>;

    if (editActive) {
        cardElement =
            <input
                id={"item-" + index + 1}
                type='text'
                className='textbox'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={props.text}
            />;
    }

    return (
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
            {cardElement}
        </div>
    );
}

export default Top5Item;