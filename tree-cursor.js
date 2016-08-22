const AbsPath = require("./abs-path")
const FSTree = require("./file-system-tree")

/**
 * Manages user's cursor location in the file-system tree.
 * A.k.a. manages the user's "working directory".
 */
module.exports = class TreeCursor {
    /** each cursor is tied to a particular user */
    constructor(user, tree) {
        this.tree = tree
        this.user = user
        this.currentAbsPath = new AbsPath("/")  // we start at the root of the file system
        this.currentNode = tree.getRoot()
    }

    // in/out of a directory, cd
    moveCursorLeft() {
        this.currentAbsPath = this.currentAbsPath.parent()
        this.currentNode = this.currentNode.getParent()
        return this
    }

    moveCursorIntoChildById(childId) {
        this.currentNode = this.currentNode.getChildById(childId)
        this.currentAbsPath = this.currentNode.getAbsolutePath()
    }

    moveCursorIntoChildByPath(childPath) {
        this.currentNode = this.currentNode.getChildByName(childPath)
        this.currentAbsPath = this.currentAbsPath.append(childPath)
    }

    // 'SET_THISUSER_CURSOR' (cd)
    // 'GET_THISUSER_CURSOR' (pwd)
    // 'RESET_THISUSER_CURSOR' (cd ~)
}
