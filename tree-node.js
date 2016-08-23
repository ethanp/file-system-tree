module.exports = class FSTNode {

    constructor(pathPiece, data, symbol) {
        this.children = []
        this.parent = null
        this.uid = symbol || Symbol()
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

    getName() {
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
        return this.isRoot() ? "/" : this.innerAbsolutePath()
    }

    innerAbsolutePath() {
        return this.isRoot() ? "" : this.parent.innerAbsolutePath() + "/" + this.pathComponent
    }

    indexOfChild(childId) {
        return this.children.findIndex(c => c.findById(childId))
    }

    previousSiblingOfChild(childId) {
        const index = this.indexOfChild(childId)
        // if index is 0, or doesn't exist, we return this (parent) node
        return index <= 0 ? this : this.children[index - 1]
    }

    getPreviousSibling() {
        return this.parent.previousSiblingOfChild(this.uid)
    }

    getNextSibling() {
        return this.nextSiblingOfChild(this.uid)
    }

    nextSiblingOfChild(childId) {
        const nextIndex = this.indexOfChild(childId) + 1
        return nextIndex < this.children.length
            ? this.children[nextIndex]
            : this.parent.nextSiblingOfChild(this.uid)
    }

    createChild(name, data, symbol) {
        const child = new FSTNode(name, data, symbol)
        return this.addChild(child)
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
        this.children = this.children.filter(c => c.getName() != pathPiece)
        return this.numChildren() < oldNumChildren
    }

    numChildren() {
        return this.children.length
    }

    getId() {
        return this.uid
    }

    /** returns undefined if the child doesn't exist */
    getChildByName(pathPiece) {
        if (pathPiece.split("/") > 1) {
            alert("unforeseen usecase: complex path pieces in getChildByName are not supported")
        }
        return this.children.find(c => c.getName() == pathPiece)
    }

    /** returns undefined if there is no first child */
    firstChild() {
        return this.children[0]
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
