/* TODO the requirements (or using import?) */
class Gui {
    constructor() {
        this.tree = new FSTree()
        this.cursor = new TreeCursor("I am a user", this.tree)
    }

    render() {
        this.renderTree()
    }

    formSubmit(textInput) {
        this.cursor.createChild(textInput)
        this.render()
    }

    createFormElem() {
        return $("<form>").submit((evt) => {
            evt.preventDefault()
            alert("submit was pressed with " + evt)
            this.formSubmit($("form").val())
        })
    }

    renderTree() {
        $("body").append(
            $("<ul>").append(
                this.renderSubtree(
                    this.tree.getRoot())))
    }

    renderSubtree(node) {
        // render this node as a basic list item
        const baseHtmlNode = $("<li>").text(node.getName())

        // if this node is expanded, also render its children
        if (node.getData().get("expanded") && node.numChildren() > 0) {
            const $ul = $("<ul>")
            node.getChildren()
                .forEach(child => $ul
                    .append(this.renderSubtree(child)))
            baseHtmlNode.append($ul)
        }
        // if this is the node where the cursor is at
        if (node == this.cursor.getNode()) {
            // give it unique styling
            baseHtmlNode.addClass("cursor")
            baseHtmlNode.append(this.createFormElem())
            // register arrow key handlers for interactive navigation
            baseHtmlNode.keyup((evt) => {
                const ArrowKey = {
                    RIGHT: 39, LEFT: 37,
                    UP: 38, DOWN: 40
                }
                if (evt.which == ArrowKey.RIGHT) {
                    if (!node.getData().get("expanded")) {
                        node.getData().set("expanded", true)
                    } else {
                        cursor.moveRight()
                    }
                    this.render()
                }
                else if (evt.which == ArrowKey.LEFT) {
                    if (node.getData().get("expanded")) {
                        node.getData().delete("expanded")
                    } else {
                        cursor.moveLeft()
                    }
                    this.render()
                }
                else if (evt.which == ArrowKey.UP) {
                    cursor.moveUp()
                    this.render()
                }
                else if (evt.which == ArrowKey.DOWN) {
                    cursor.moveDown()
                    this.render()
                }
            })
        }
        // clicking on this node should move the cursor to it
        baseHtmlNode.click(() => {
            console.log("base click")
            this.cursor.moveToId(node.getId())
            this.render()
        })
        return baseHtmlNode
    }
}

// create a blank gui
const gui = new Gui()

// render it for visualization and interaction
gui.render()
