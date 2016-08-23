const FSTree = require('../file-system-tree')
const FSTNode = require('../tree-node')
const TreeCursor = require('../tree-cursor')
const assert = require('assert')

const createBasicCursor = (p_tree) => {
    const tree = p_tree || new FSTree()
    const user = { user: "someone" }
    const cursor = new TreeCursor(user, tree)
    return cursor
}

const addChild = (cursor, p_name) => {
    const name = p_name || "child"
    const data = { data: "DATA" }
    const symbol = Symbol()
    cursor.createChild(name, data, symbol)
}
describe("a cursor", () => {
    it("should be creatable", () => {
        const cursor = createBasicCursor()
    })
    it("should start out at root", () => {
        const tree = new FSTree()
        const cursor = createBasicCursor(tree)
        return assert.equal(cursor.getCurrentNode(), tree.getRoot())
    })
    it("should let you make a child", () => {
        const cursor = createBasicCursor()
        addChild(cursor)
        return assert.equal(cursor.getCurrentNode().numChildren(), 1)
    })
    it("should go 'down' into that child", () => {
        const cursor = createBasicCursor()
        addChild(cursor, "child")
        cursor.moveCursorDown()
        return assert.equal(cursor.getCurrentNode().getName(), "child")
    })
    it("should go 'up' back into the root", () => {
        const cursor = createBasicCursor()
        addChild(cursor, "child")
        cursor.moveCursorDown()
        cursor.moveCursorUp()
        return assert.equal(cursor.getCurrentNode().isRoot(), true)
    })
})
