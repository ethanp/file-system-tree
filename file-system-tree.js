const FSTNode = require('./tree-node')
const pathObj = require('./abs-path')

// TODO symlinks
// TODO search

module.exports = class FSTree {
    constructor() {
        this.root = new FSTNode("")
    }

    /**
     * @return [node] all the nodes in this tree as an array
     * (depth-first)
     */
    allNodes() {
        return this.root.getSubtree()
    }

    getRoot() {
        return this.root
    }

    getNodeByID(id) {
        return this.root.findByID(id)
    }

    /** returns a simple string visualization of the entire tree */
    treeString() {
        return this.root.treeString()
    }

    getDataByAbsolutePath(path) {
        return this.getNodeByAbsolutePath(path).getData()
    }

    /**
     * It still could be useful for the client to see the FSTNode objects if they want to
     * direct manipulation of the tree. Or should that be a nono?
     */
    getNodeByAbsolutePath(path) {
        return path.split("/") // get array of path components
            .filter(s => s != "") // remove the root and any trailing slash
            .reduce( // travel down tree
                (cur, next) => cur == null ? null : cur.getChildByName(next),
                this.root
            )
    }

    /** absolute path to parentDir is required if the given path is not absolute */
    createNodeAtPath(path, data, parentDir) {
        if (FSTree.createNodeArgsInvalid(parentDir, path)) {
            console.error(`invalid arguments ${path}, ${data}, ${parentDir} to Tree.createNodeAtPath`)
            return null
        }
        if (path.charAt(0) !== "/") path = parentDir + path
        const node = new FSTNode(this.root.getNodeAtRelativePath(path.substring(1)), data)
        return node != null
    }

    createNodeArgsInvalid(parentDir, path) {
        const parentDirIsNotAbsolute = parentDir == undefined || parentDir.charAt(0) !== "/"
        const pathIsNotAbsolute = path.charAt(0) != "/"
        return pathIsNotAbsolute || parentDirIsNotAbsolute
    }

    /** returns the parent FSTNode*/
    addNode(node, parentPath) {
        if (parentPath == null || parentPath == "") return this.root.addChild(node)
        const parent = this.getNodeByAbsolutePath(parentPath)
        return {
            success: parent == null ? false : parent.addChild(node),
            tree: this
        }
    }

    deleteNode(path) {
        const pathObj = new pathObj(path)
        const parentNode = this.getNodeByAbsolutePath(pathObj.parent())
        return {
            success: parentNode == null ? null : parentNode.removeChild(pathObj.basename()),
            tree: this
        }
    }

    /** move FSTNode "component" from "oldDir" to "newDir" */
    moveNode(component, oldDir, newDir) {
        const oldParent = this.getNodeByAbsolutePath(oldDir)
        const node = oldParent.getChildByName(component)
        oldParent.removeChild(component)
        const newParent = this.getNodeByAbsolutePath(newDir)
        newParent.addChild(node)
        return this
    }
}
