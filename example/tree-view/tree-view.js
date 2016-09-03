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
        this.registerNavigationHandlers()
    }

    registerNavigationHandlers() {
        const expandOrMoveRight = (node) => {
            if (!node.getData().get("expanded")) {
                node.getData().set("expanded", true)
            } else {
                this.cursor.moveRight()
            }
        }
        const unexpandOrMoveLeft = (node) => {
            if (node.getData().get("expanded")) {
                node.getData().delete("expanded")
            } else {
                this.cursor.moveLeft()
            }
        }
        const ArrowKey = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        }
        const node = this.cursor.getNode()
        $("body").keyup((evt) => {
            switch (evt.which) {
                case ArrowKey.RIGHT:
                    console.log("navigating right")
                    expandOrMoveRight.call(this, node)
                    this.render()
                    break
                case ArrowKey.LEFT:
                    console.log("navigating left")
                    unexpandOrMoveLeft.call(this, node)
                    this.render()
                    break
                case ArrowKey.UP:
                    console.log("navigating up")
                    this.cursor.moveUp()
                    this.render()
                    break
                case ArrowKey.DOWN:
                    console.log("navigating down")
                    this.cursor.moveDown()
                    this.render()
                    break
            }
        })
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
