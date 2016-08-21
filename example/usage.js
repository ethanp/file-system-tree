const FSTree = require("../file-system-tree")
const FSTNode = require("../tree-node")
const tree = new FSTree()

// TODO this method does not exist
tree.createNodeAtPath("/somewhere/over/the/rainbow", {text: "hello"})

const node = tree.getNodeByAbsolutePath("/somewhere/over/the/rainbow")
