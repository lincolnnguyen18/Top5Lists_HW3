import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * MoveItem_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
    
    @author McKilla Gorilla
 */
export default class RenameItem_Transaction extends jsTPS_Transaction {
    constructor(initStore, initOldName, initNewName, initIndex) {
        super();
        this.store = initStore;
        this.oldItemName = initOldName;
        this.newItemName = initNewName;
        this.index = initIndex;
    }

    doTransaction() {
        this.store.renameItemAtIndex(this.index, this.newItemName);
    }
    
    undoTransaction() {
        this.store.renameItemAtIndex(this.index, this.oldItemName);
    }
}