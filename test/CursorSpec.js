const FSTree = require('../file-system-tree')
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
        _cursor.createChild(name, data, symbol)
        _cursor.moveToChildByName(name)
        assert.equal(symbol, _cursor.getId())
        _cursor.moveLeft()
        return symbol
    }

    it("should start out at root", () => {
        const tree = new FSTree()
        const cursor = createBasicCursor(tree)
        return assert.equal(cursor.getNode(), tree.getRoot())
    })
    it("should let you make a child", () => {
        addChild()
        return assert.equal(basicCursor.getNode().numChildren(), 1)
    })
    it("should go 'down' into that child", () => {
        addChild()
        returnsThis(basicCursor.moveDown())
        return assert.equal(basicCursor.getNode().getName(), FIRST_CHILD_NAME)
    })
    it("should go 'up' back into the root", () => {
        addChild()
        basicCursor.moveDown()
        returnsThis(basicCursor.moveUp())
        return assert.equal(basicCursor.getNode().isRoot(), true)
    })
    it("should go to child by child name", () => {
        addChild()
        returnsThis(basicCursor.moveToChildByName(FIRST_CHILD_NAME))
        return assert.equal(basicCursor.getNode().getName(), FIRST_CHILD_NAME)
    })
    it("should move left", () => {
        addChild()
        basicCursor.moveToChildByName(FIRST_CHILD_NAME)
        returnsThis(basicCursor.moveLeft())
        return assert.equal(basicCursor.getNode().isRoot(), true)
    })
    it("should go to first child on 'right'", () => {
        addChild()
        returnsThis(basicCursor.moveRight())
        return assert.equal(basicCursor.getNode().getName(), FIRST_CHILD_NAME)
    })
    it("should go to any node by id", () => {
        const id = addChild()
        returnsThis(basicCursor.moveToId(id))
        return assert.equal(basicCursor.getNode().getName(), FIRST_CHILD_NAME)
    })
    it("should go to any node by absolute path", () => {
        addChild()
        returnsThis(basicCursor.moveToPath(`/${FIRST_CHILD_NAME}`))
        return assert.equal(basicCursor.getNode().getName(), FIRST_CHILD_NAME)
    })
    it("should be able to print its current absolute path", () => {
        addChild()
        assert.equal(basicCursor.getAbsPath(), "/")
        basicCursor.moveToPath(`/${FIRST_CHILD_NAME}`)
        assert.equal(basicCursor.getAbsPath(), `/${FIRST_CHILD_NAME}`)
        return assert.equal(basicCursor.getNode().getName(), FIRST_CHILD_NAME)
    })
    it("should be able to jump to and print its current absolute path in a lower child", () => {
        assert.equal(basicCursor.getAbsPath(), "/")
        const nestedChildName = "humor."
        addChild()
        basicCursor.moveRight()
        assert.equal(basicCursor.getAbsPath(), `/${FIRST_CHILD_NAME}`)
        addChild(nestedChildName)
        const nestedPath = `/${FIRST_CHILD_NAME}/${nestedChildName}`
        returnsThis(basicCursor.moveToPath(nestedPath))
        assert.equal(basicCursor.getAbsPath(), nestedPath)
    })
    it("should be able to reset to root", () => {
        const nestedChildName = "humor."
        addChild()
        basicCursor.moveRight()
        addChild(nestedChildName)
        const nestedPath = `/${FIRST_CHILD_NAME}/${nestedChildName}`
        basicCursor.moveToPath(nestedPath)
        assert.equal(basicCursor.getAbsPath(), nestedPath)
        returnsThis(basicCursor.resetToRoot())
        return assert.equal(basicCursor.getAbsPath(), "/")
    })
    it("should be able to list all nodes", () => {
        const p = "p"
        const p2 = "p2"
        addChild()
        basicCursor.moveRight()
        addChild(p)
        addChild(p2)
        basicCursor.moveToChildByName(p2)
        addChild(p)
        const treeNodePaths = new Set(basicCursor.getAllPaths())
        const expectedAbsolutePaths = [
            "/",
            `/${FIRST_CHILD_NAME}`,
            `/${FIRST_CHILD_NAME}/${p}`,
            `/${FIRST_CHILD_NAME}/${p2}`,
            `/${FIRST_CHILD_NAME}/${p2}/${p}`,
        ]
        expectedAbsolutePaths.forEach(path => assert.equal(treeNodePaths.delete(path), true, path))
        return assert.equal(treeNodePaths.size, 0)
    })
})
