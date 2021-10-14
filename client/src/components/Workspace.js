import { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Top5Item from './Top5Item.js'
import { GlobalStoreContext } from '../store'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function Workspace() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            let textbox = document.getElementById('textbox');
            if (textbox && e.keyCode === 13) {
                e.preventDefault();
                let index = textbox.parentElement.id.split('-')[1];
                console.log(index);
                console.log(textbox.value);
                store.setListNameEditActive(false);
                // console.log(store.currentList._id);
                store.setCurrentList(store.currentList._id);
                return false;
            }
        });
    }, []);

    let editItems = "";
    if (store.currentList) {
        editItems = 
            <div id="edit-items">
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item 
                            id={'top5-item-' + (index+1)}
                            key={'top5-item-' + (index+1)}
                            text={item}
                            index={index} 
                        />
                    ))
                }
            </div>;
    }
    return (
        <div id="top5-workspace">
            <div id="workspace-edit">
                <div id="edit-numbering">
                    <div className="item-number">1.</div>
                    <div className="item-number">2.</div>
                    <div className="item-number">3.</div>
                    <div className="item-number">4.</div>
                    <div className="item-number">5.</div>
                </div>
                {editItems}
            </div>
        </div>
    )
}

export default Workspace;