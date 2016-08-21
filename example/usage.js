const FSTree = require("../file-system-tree")
const tree = new FSTree()

tree.createNodeAtPath("/somewhere/over/the/rainbow", {text: "hello"})

// this returns a Map() containing the data
const data = tree.getDataByAbsolutePath("/somewhere/over/the/rainbow")
