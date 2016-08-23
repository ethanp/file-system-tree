/**
 * Manages user's cursor location in the file-system tree.
 * A.k.a. manages the user's "working directory".
 */
module.exports = class TreeCursor {
    /** each cursor is tied to a particular user */
    constructor(user, tree) {
        this.tree = tree
        this.user = user
        // TODO can we make this private somehow?
        this.currentNode = tree.getRoot()
    }

    // in/out of a directory, cd
    moveCursorLeft() {
        this.currentNode = this.currentNode.getParent()
        return this
    }

    /** move into first child */
    moveCursorRight() {
        const firstChild = this.currentNode.firstChild()
        if (firstChild != undefined) this.currentNode = firstChild
        return this
    }

    moveCursorIntoChildById(childId) {
        this.currentNode = this.currentNode.getChildById(childId)
        return this
    }

    moveCursorIntoChildByPath(childPath) {
        this.currentNode = this.currentNode.getChildByName(childPath)
        return this
    }

    /** if this is the first sibling, this command will 'pop' up a directory */
    moveCursorUp() {
        this.currentNode = this.currentNode.previousSibling()
        return this
    }

    /** if this is the first sibling, this command will 'pop' to the "next" directory */
    moveCursorDown() {
        this.currentNode = this.currentNode.nextSibling()
        return this
    }

    moveCursorToId(nodeId) {
        this.currentNode = this.tree.getNodeById(nodeId)
        return this
    }

    moveCursorToPath(absolutePath) {
        this.currentNode = this.tree.getNodeByAbsolutePath(absolutePath)
        return this
    }

    /** pwd */
    getCurrentAbsolutePath() {
        return this.currentNode.getAbsolutePath()
    }

    getCurrentNode() {
        // TODO copy it?
        return this.currentNode
    }

    // 'RESET_THISUSER_CURSOR' (cd ~)
    resetToRoot() {
        this.currentNode = this.tree.getRoot()
        return this
    }

    /** returns the created node's symbol */
    createChild(name, data, symbol) {
        this.currentNode.createChild(name, data, symbol)
        return this
    }

    /** this is for testing */
    getRepr() {
        return this.currentNode.getSymbol()
    }
}
