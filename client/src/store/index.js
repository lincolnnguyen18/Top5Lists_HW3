import { createContext, useState, useEffect } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        isListNameEditActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        listToDelete: {name: null, id: null},
        editItemIndex: null
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    store.setEditItemIndex = (index) => {
        setStore({
            idNamePairs: store.idNamePairs,
            currentList: store.currentList,
            newListCounter: store.newListCounter,
            isListNameEditActive: store.isListNameEditActive,
            isItemEditActive: true,
            listMarkedForDeletion: store.listMarkedForDeletion,
            editItemIndex: index
        });
    }

    store.renameItemAtIndex = (index, newName) => {
        console.log('test');
        let newItems = store.currentList.items.slice();
        newItems[index - 1] = newName;
        // console.log(store.currentList.items, newItems);
        let oldList = store.currentList;
        let newList = {
            ...store.currentList,
            items: newItems
        }
        // console.log(oldList, newList);
        api.updateTop5ListById(store.currentList._id, newList);
        // setStore({
        //     idNamePairs: store.idNamePairs,
        //     currentList: {
        //         ...store.currentList,
        //         items: newItems
        //     },
        //     newListCounter: store.newListCounter,
        //     isListNameEditActive: false,
        //     isItemEditActive: false,
        //     listMarkedForDeletion: null,
        // });
    }

    store.setListNameEditActive = (status) => {
        setStore({
            idNamePairs: store.idNamePairs,
            currentList: store.currentList,
            newListCounter: store.newListCounter,
            isListNameEditActive: status,
            isItemEditActive: false,
            listMarkedForDeletion: null,
        });
    }

    store.setListToDelete = (name, id) => {
        setStore({
            idNamePairs: store.idNamePairs,
            currentList: store.currentList,
            newListCounter: store.newListCounter,
            isListNameEditActive: store.isListNameEditActive,
            isItemEditActive: store.isItemEditActive,
            listMarkedForDeletion: id,
            listToDelete: {name: name, id: id},
        });
    }

    store.createList = () => {
        const allLists = store.idNamePairs;
        // Get the largest untitled list number in allLists
        // console.log(allLists);
        let max = 0;
        allLists.forEach(list => {
            if (list.name.includes("Untitled")) {
                let num = parseInt(list.name.substring(8));
                if (num > max) {
                    max = num;
                }
            }
        });
        // console.log(`max is ${max}`);
        max += 1;

        let newList = {
            "name": `Untitled ${max}`,
            "items": [
                "Item 1",
                "Item 2",
                "Item 3",
                "Item 4",
                "Item 5"
            ]
        }
        api.createTop5List(newList)
            .then(res => {
                res = res.data;
                const newList = res.top5List;
                // console.log(newList);
                // console.log(store.idNamePairs);
                let newIdNamePairs = [...store.idNamePairs, {_id: newList._id, name: newList.name}];
                // console.log(newIdNamePairs);
                setStore({
                    idNamePairs: newIdNamePairs,
                    currentList: null,
                    newListCounter: 'lol',
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                });
                // console.log(store.idNamePairs);
                store.setCurrentList(newList._id);
            })
            .catch(err => {
                console.log(err);
            });
    }

    store.deleteList = (id) => {
        console.log(id);
        api.deleteTop5ListById(id).then(() => {
            // console.log('success');
            // console.log(store.idNamePairs);
            const newIdNamePairs = store.idNamePairs.filter(pair => pair._id !== id);
            // console.log(newIdNamePairs);
            setStore({
                idNamePairs: newIdNamePairs,
                currentList: null,
                newListCounter: store.newListCounter,
                isListNameEditActive: false,
                isItemEditActive: false,
                listMarkedForDeletion: id,
            });
        }).catch(err => {
            // console.log('error');
            console.log(err);
        });
    }

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.name = newName;
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        async function getListPairs(top5List) {
                            response = await api.getTop5ListPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        top5List: top5List
                                    }
                                });
                            }
                        }
                        getListPairs(top5List);
                    }
                }
                updateList(top5List);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    store.getStore = async function () {
        return store;
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getTop5ListPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;

                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: top5List
                    });
                    store.history.push("/top5list/" + top5List._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.addMoveItemTransaction = function (start, end) {
        let transaction = new MoveItem_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    store.moveItem = function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.canUndo = () => {
        return tps.hasTransactionToUndo();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canRedo = () => {
        return tps.hasTransactionToRedo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}