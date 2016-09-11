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

    getChildren() {
        return this.children
    }

    getParent() {
        return this.parent
    }

    setParent(node) {
        this.parent = node
        return this
    }

    getId() {
        return this.uid
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
        if (this.uid === id) return this
        for (let i in this.getChildren()) {
            const findById2 = this.getChildren()[i].findById(id)
            if (findById2 != undefined) return findById2
        }
        return undefined
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

    /** returns -1 if the child is not found */
    indexOfChild(childId) {
        return this.children.findIndex(c => c.getId() === childId)
    }

    previousSiblingOfChild(childId) {
        const i = this.indexOfChild(childId)
        return i > 0 ? this.getChildAtIndex(i - 1) : this;
    }

    /**
     * If this is the first sibling, this command will go to the parent directory
     */
    getPreviousSibling() {
        return this.isRoot() ? this : this.parent.previousSiblingOfChild(this.uid)
    }

    /**
     * If this is the last sibling, this command will 'pop' to the "next" directory
     * if there is one, otherwise it will not move.
     */
    getNextSibling() {
        if (this.isRoot()) {
            return this;
        }
        const nextSibling = this.parent.nextSiblingOfChild(this.uid)
        if (nextSibling == undefined) {
            // no next sibling was found
            return this
        }
        return nextSibling
    }

    /**
     * given the id of a child, return the "next" child,
     * or if that child has no "next child", return _this_ node's next sibling
     *
     * returns undefined if no child has the given childId
     */
    nextSiblingOfChild(childId) {
        const nextIndex = this.indexOfChild(childId) + 1
        if (nextIndex === 0) {
            /* child was not found at all */
            return undefined
        } else if (nextIndex < this.numChildren()) {
            /* this is the normal case */
            return this.getChildren()[nextIndex]
        } else {
            /* this was the last child, so get _this_ node's next sibling */
            return this.isRoot() ? this : this.parent.nextSiblingOfChild(this.uid)
        }
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

    /** returns true if a FSTNode was removed */
    removeChild(pathPiece) {
        const oldNumChildren = this.numChildren()
        this.children = this.children.filter(c => c.getName() != pathPiece)
        return this.numChildren() < oldNumChildren
    }

    numChildren() {
        return this.getChildren().length
    }

    /** returns undefined if the child doesn't exist */
    getChildByName(pathPiece) {
        if (pathPiece.split("/") > 1) {
            alert("unforeseen usecase: complex path pieces in getChildByName are not supported")
        }
        return this.getChildren().find(c => c.getName() == pathPiece)
    }

    /** returns undefined if there is no first child */
    firstChild() {
        return this.children[0]
    }

    /** create a simple string visualization of this FSTNode and its descendents */
    treeString() {
        return this.getChildren().reduce(
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
        return this.getChildren().reduce(
            (prev, cur) => prev.concat(cur.getSubtree()), [this]
        )
    }

    getChildAtIndex(number) {
        return this.getChildren()[number]
    }
}
