/**
 * Manages user's cursor location in the file-system tree.
 * A.k.a. manages the user's "working directory".
 *
 * Methods that don't return `this` are prefixed with "get"
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
    moveLeft() {
        if (!this.currentNode.isRoot()) this.currentNode = this.currentNode.getParent()
        return this
    }

    /** move into first child */
    moveRight() {
        const firstChild = this.currentNode.firstChild()
        if (firstChild != undefined) this.currentNode = firstChild
        return this
    }

    /** if this is the first sibling, this command will 'pop' up a directory */
    moveUp() {
        this.currentNode = this.currentNode.getPreviousSibling()
        return this
    }

    /** if this is the first sibling, this command will 'pop' to the "next" directory */
    moveDown() {
        this.currentNode = this.currentNode.getNextSibling()
        return this
    }

    moveToChildByName(childName) {
        this.currentNode = this.currentNode.getChildByName(childName)
        return this
    }

    moveToId(nodeId) {
        this.currentNode = this.tree.getNodeById(nodeId)
        return this
    }

    moveToPath(absolutePath) {
        this.currentNode = this.tree.getNodeByAbsolutePath(absolutePath)
        return this
    }

    /** pwd */
    getAbsPath() {
        return this.currentNode.getAbsolutePath()
    }

    getNode() {
        return this.currentNode
    }

    // 'RESET_THISUSER_CURSOR' (cd ~)
    resetToRoot() {
        this.currentNode = this.tree.getRoot()
        return this
    }

    /** both `data` and `symbol` are optional */
    createChild(name, data, symbol) {
        data = data || {}
        symbol = symbol || Symbol()
        this.currentNode.createChild(name, data, symbol)
        return this
    }

    /** returns the id of the current node */
    getId() {
        return this.currentNode.getId()
    }

    /** returns an array of nodes */
    getFullTreeAsArray() {
        return this.tree.allNodes()
    }

    getAllPaths() {
        return this.getFullTreeAsArray().map(node => node.getAbsolutePath())
    }
}
