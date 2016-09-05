const FSTree = require('../file-system-tree')
const TreeCursor = require('../tree-cursor')
const assert = require('assert')

const createBasicCursor = (p_tree) =>
    new TreeCursor("someone", p_tree || new FSTree())

describe("a cursor", () => {
    // this is the cursor used by most of these tests
    let basicCursor = null
    beforeEach("create a cursor", () => {
        basicCursor = createBasicCursor()
        return assert.notEqual(basicCursor, null)
    })

    /** used to ensure that (most) actions on the cursor return the cursor itself */
    const returnsThis = (actionResult) =>
        assert.deepStrictEqual(basicCursor, actionResult)

    const FIRST_CHILD_NAME = "child"

    /** @returns the id of the created child */
    const addChild = (name, cursor) => {
        name = name || FIRST_CHILD_NAME
        cursor = cursor || basicCursor
        const data = { data: "DATA" }
        const symbol = Symbol()
        cursor.createChild(name, data, symbol)
        // make sure the child was created with the right name
        cursor.moveToChildByName(name)
        // and the right symbol
        assert.equal(symbol, cursor.getId())
        // but move the cursor back out to the parent node
        cursor.moveLeft()
        return symbol
    }

    it("should start out at root", () => {
        const tree = new FSTree()
        const cursor = createBasicCursor(tree)
        return assert.equal(cursor.getNode(), tree.getRoot())
    })
    it("should let you make children", () => {
        addChild()
        assert.equal(basicCursor.getNode().numChildren(), 1)
        addChild("2nd one")
        return assert.equal(basicCursor.getNode().numChildren(), 2)
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
    it("should go to outer nodes by id", () => {
        const id = addChild()
        const id2 = addChild("2nd")
        returnsThis(basicCursor.moveToId(id))
        assert.equal(basicCursor.getNode().getName(), FIRST_CHILD_NAME)
        basicCursor.moveToId(id2)
        assert.equal(basicCursor.getNode().getName(), "2nd")
    })
    it("should go to a 3rd level deep node by id", () => {
        const id1 = addChild()
        const id2 = addChild("level1")
        basicCursor.moveRight()
        const id3 = addChild("level2")
        basicCursor.moveRight()
        const id4 = addChild("level3")
        basicCursor.moveToId(id1)
        assert.equal(basicCursor.getNode().getName(), FIRST_CHILD_NAME)
        basicCursor.moveToId(id2)
        assert.equal(basicCursor.getNode().getName(), "level1")
        basicCursor.moveToId(id3)
        assert.equal(basicCursor.getNode().getName(), "level2")
        basicCursor.moveToId(id4)
        return assert.equal(basicCursor.getNode().getName(), "level3")
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
