const FSTree = require("../file-system-tree")
const FSTNode = require("../tree-node")
const tree = new FSTree()

// TODO this method does not exist
tree.addNode("/somewhere/over/the/rainbow")

const node: FSTNode = tree.getNodeByAbsolutePath("/somewhere/over/the/rainbow")
