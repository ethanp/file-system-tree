
/**
 * Manages user's cursor location in the file-system tree.
 * A.k.a. manages the user's "working directory".
 */
module.exports = class TreeCursor {
    /** each cursor is tied to a particular user */
    constructor(user, tree) {
        this.tree = tree
        this.user = user
        this.currentNode = tree.getRoot()
    }

    // in/out of a directory, cd
    moveCursorLeft() {
        this.currentNode = this.currentNode.getParent()
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

    // 'RESET_THISUSER_CURSOR' (cd ~)
    resetToRoot() {
        this.currentNode = this.tree.getRoot()
        return this
    }
}
