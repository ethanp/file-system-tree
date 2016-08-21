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

    findByID(id) {
        return this.uid == id ? this : this.children.find(c => c.findByID(id));
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

    addChild(child) {
        this.children.push(child)
        child.setParent(this)
        return this
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

    /** returns undefined if the child doesn't exist */
    getChild(pathPiece) {
        if (pathPiece.split("/") > 1) {
            alert("unforeseen usecase: complex path pieces in getChild are not supported")
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
