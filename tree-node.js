module.exports = class FSTNode {

    constructor(pathPiece, data) {
        this.children = []
        this.parent = null
        this.uid = Symbol()
        this.pathComponent = pathPiece
        this.data = new Map()

        // add data object parameter to the internal data `Map`
        if (data != null) Object.keys(data).forEach(key =>
            this.data.set(key, data[key])
        )
    }

    getData() {
        return this.data // this implementation could change
    }

    getPathComponent() {
        return this.pathComponent
    }

    isRoot() {
        return this.parent == null
    }

    findById(id) {
        return this.uid == id ? this : this.children.find(c => c.findById(id));
    }

    getNodeAtRelativePath(path) {
        // TODO implement
        throw new NotImplementedException()
    }

    getAbsolutePath() {
        return this.isRoot()
            ? this.pathComponent
            : this.parent.getAbsolutePath() + "/" + this.pathComponent;
    }

    indexOfChild(childId) {
        return this.children.findIndex(c => c.findById(childId))
    }

    previousSiblingOfChild(childId) {
        const index = this.indexOfChild(childId)
        // if index is 0, or doesn't exist, we return this (parent) node
        return index <= 0 ? this : this.children[index - 1]
    }

    previousSibling() {
        return this.previousSiblingOfChild(this.uid)
    }

    nextSibling() {
        return this.nextSiblingOfChild(this.uid)
    }

    nextSiblingOfChild(childId) {
        const index = this.indexOfChild(childId)
        if (index + 1 < this.children.length) {
            return this.children[index + 1]
        } else {
            // TODO
        }
    }

    addChild(child) {
        this.children.push(child)
        child.setParent(this)
        return this
    }

    getParent() {
        return this.parent
    }

    setParent(node) {
        this.parent = node
        return this
    }

    /** returns true if a FSTNode was removed */
    removeChild(pathPiece) {
        const oldNumChildren = this.numChildren()
        this.children = this.children.filter(c => c.getPathComponent() != pathPiece)
        return this.numChildren() < oldNumChildren
    }

    numChildren() {
        return this.children.length
    }

    getChildById(childId) {
        return this.children.find(c => c.getSymbol() == childId)
    }

    getChildIndexById(childId) {
        return this.children.findIndex(c => c.getSymbol() == childId)
    }

    getSymbol() {
        return this.uid
    }

    /** returns undefined if the child doesn't exist */
    getChildByName(pathPiece) {
        if (pathPiece.split("/") > 1) {
            alert("unforeseen usecase: complex path pieces in getChildByName are not supported")
        }
        return this.children.find(c => c.getPathComponent() == pathPiece)
    }

    /** create a simple string visualization of this FSTNode and its descendents */
    treeString() {
        return this.children.reduce(
            (prev, cur) => prev.concat(
                cur.treeString().map(l => "\t" + l)),
            [this.pathComponent]
        )
    }

    /**
     * get an array that starts with this FSTNode, and contains all its descendents
     * (pre-order, depth-first)
     */
    getSubtree() {
        return this.children.reduce(
            (prev, cur) => prev.concat(cur.getSubtree()), [this]
        )
    }
}
