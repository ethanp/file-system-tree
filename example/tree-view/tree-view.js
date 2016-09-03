/* TODO the requirements (or using import?) */
class Gui {
    constructor() {
        this.tree = new FSTree()
        this.cursor = new TreeCursor("I am a user", this.tree)
    }

    /** clear and re-build the tree from scratch */
    render() {
        $("body").empty()
        this.renderTree()
    }

    formSubmit(textInput) {
        this.cursor.createChild(textInput)
        this.render()
    }

    createFormElem() {
        const $form = $("<form>First name</form>")
        const $input = $("<input type='text' name='lastname'>")
        const $button = $("<input type='submit' value='Submit'>")
        $form.append($input)
        $form.append($button)
        $button.click((evt) => {
            evt.preventDefault()
            const inputText = $input.val()
            this.formSubmit(inputText)
        })
        return $form
    }

    renderTree() {
        $("body").append(
            $("<ul>").append(
                this.renderSubtree(
                    this.tree.getRoot())))
        // register arrow key handlers for interactive navigation
        $("body").keyup((evt) => {
            const ArrowKey = {
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40
            }
            const node = this.cursor.getNode()
            if (evt.which == ArrowKey.RIGHT) {
                if (!node.getData().get("expanded")) {
                    node.getData().set("expanded", true)
                } else {
                    this.cursor.moveRight()
                }
                this.render()
            }
            else if (evt.which == ArrowKey.LEFT) {
                if (node.getData().get("expanded")) {
                    node.getData().delete("expanded")
                } else {
                    this.cursor.moveLeft()
                }
                this.render()
            }
            else if (evt.which == ArrowKey.UP) {
                this.cursor.moveUp()
                this.render()
            }
            else if (evt.which == ArrowKey.DOWN) {
                this.cursor.moveDown()
                this.render()
            }
        })
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
        }
        // clicking on this node should move the cursor to it
        //baseHtmlNode.click(() => {
        //    console.log("base click")
        //    this.cursor.moveToId(node.getId())
        //    this.render()
        //})
        return baseHtmlNode
    }
}

// create a blank gui
const gui = new Gui()

// render it for visualization and interaction
gui.render()
