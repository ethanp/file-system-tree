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

describe("a cursor", () => {
    let basicCursor = null

    const returnsThis = (actionResult) => {
        return assert.deepStrictEqual(basicCursor, actionResult)
    }

    beforeEach("create a cursor", () => {
        basicCursor = createBasicCursor()
        return assert.notEqual(basicCursor, null)
    })

    const FIRST_CHILD_NAME = "child"

    const addChild = (p_name, cursor) => {
        const _cursor = cursor || basicCursor
        const name = p_name || FIRST_CHILD_NAME
        const data = { data: "DATA" }
        const symbol = Symbol()
        const ret = _cursor.createChild(name, data, symbol)
        assert.equal(ret.getRepr(), _cursor.getRepr())
        return symbol
    }

    it("should start out at root", () => {
        const tree = new FSTree()
        const cursor = createBasicCursor(tree)
        return assert.equal(cursor.getCurrentNode(), tree.getRoot())
    })
    it("should let you make a child", () => {
        addChild()
        return assert.equal(basicCursor.getCurrentNode().numChildren(), 1)
    })
    it("should go 'down' into that child", () => {
        addChild()
        returnsThis(basicCursor.moveDown())
        return assert.equal(basicCursor.getCurrentNode().getName(), FIRST_CHILD_NAME)
    })
    it("should go 'up' back into the root", () => {
        addChild()
        returnsThis(basicCursor.moveDown())
        returnsThis(basicCursor.moveUp())
        return assert.equal(basicCursor.getCurrentNode().isRoot(), true)
    })
    it("should go to child by child name", () => {
        addChild()
        returnsThis(basicCursor.moveToChildByPath(FIRST_CHILD_NAME))
        return assert.equal(basicCursor.getCurrentNode().getName(), FIRST_CHILD_NAME)
    })
    it("should move left", () => {
        addChild()
        returnsThis(basicCursor.moveToChildByPath(FIRST_CHILD_NAME))
        returnsThis(basicCursor.moveCursorLeft())
        return assert.equal(basicCursor.getCurrentNode().isRoot(), true)
    })
    it("should go to child by id", () => {
        const id = addChild()
        returnsThis(basicCursor.moveToChildById(id))
        return assert.equal(basicCursor.getCurrentNode().getName(), FIRST_CHILD_NAME)
    })
    it("should go to first child on 'right'", () => {
        addChild()
        returnsThis(basicCursor.moveRight())
        return assert.equal(basicCursor.getCurrentNode().getName(), FIRST_CHILD_NAME)
    })
    it("should go to any node by id", () => {
        const id = addChild()
        returnsThis(basicCursor.moveCursorToId(id))
        return assert.equal(basicCursor.getCurrentNode().getName(), FIRST_CHILD_NAME)
    })
    it("should go to any node by absolute path", () => {
        addChild()
        returnsThis(basicCursor.moveCursorToPath(`/${FIRST_CHILD_NAME}`))
        return assert.equal(basicCursor.getCurrentNode().getName(), FIRST_CHILD_NAME)
    })
    it("should be able to print its current absolute path", () => {
        addChild()
        assert.equal(basicCursor.getCurrentAbsolutePath(), "/")
        returnsThis(basicCursor.moveCursorToPath(`/${FIRST_CHILD_NAME}`))
        assert.equal(basicCursor.getCurrentAbsolutePath(), `/${FIRST_CHILD_NAME}`)
        return assert.equal(basicCursor.getCurrentNode().getName(), FIRST_CHILD_NAME)
    })
    it("should be able to jump to and print its current absolute path in a lower child", () => {
        assert.equal(basicCursor.getCurrentAbsolutePath(), "/")
        const nestedChildName = "humor."
        addChild()
        returnsThis(basicCursor.moveRight())
        assert.equal(basicCursor.getCurrentAbsolutePath(), `/${FIRST_CHILD_NAME}`)
        addChild(nestedChildName)
        const nestedPath = `/${FIRST_CHILD_NAME}/${nestedChildName}`
        returnsThis(basicCursor.moveCursorToPath(nestedPath))
        assert.equal(basicCursor.getCurrentAbsolutePath(), nestedPath)
        return assert.equal(basicCursor.getCurrentNode().getName(), nestedChildName)
    })
})
