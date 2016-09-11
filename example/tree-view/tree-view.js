/* TODO the requirements (or using import?) */
class Gui {
    constructor() {
        this.tree = new FSTree()
        this.cursor = new TreeCursor("I am a user", this.tree)
    }

    /** clear and re-build the tree from scratch */
    render() {
        this.renderTree()
        this.registerNavigationHandlers()
    }

    /**
     * handlers for the arrow keys
     */
    registerNavigationHandlers() {
        const ArrowKey = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        }
        // clear old keypress handlers,
        // add new keypress handlers
        $("body").off("keyup").keyup((evt) => {
            switch (evt.which) {
                case ArrowKey.RIGHT:
                    this.rightKeyPressed()
                    break
                case ArrowKey.LEFT:
                    this.leftKeyPressed()
                    break
                case ArrowKey.UP:
                    this.upKeyPressed()
                    break
                case ArrowKey.DOWN:
                    this.downKeyPressed()
                    break
            }
        })
    }

    downKeyPressed() {
        console.log("navigating down")
        this.cursor.moveDown()
        this.render()
    }

    upKeyPressed() {
        console.log("navigating up")
        this.cursor.moveUp()
        this.render()
    }

    leftKeyPressed() {
        console.log("navigating left")
        this.unexpandOrMoveLeft()
        this.render()
    }

    unexpandOrMoveLeft() {
        const data = this.cursor.getNode().getData()
        if (data.get("expanded")) {
            data.delete("expanded")
        } else {
            this.cursor.moveLeft()
        }
    }

    expandOrMoveRight() {
        const data = this.cursor.getNode().getData()
        if (data.get("expanded") !== true) {
            data.set("expanded", true)
        } else {
            this.cursor.moveRight()
        }
    }

    rightKeyPressed() {
        console.log("navigating right")
        this.expandOrMoveRight()
        this.render()
    }

    formSubmit(textInput) {
        this.cursor.createChild(textInput)
        this.render()
    }

    /**
     * Creates a form with a text input box and a submit button.
     * @return {$("<form>")} the form as a jQuery object
     */
    createFormElem() {
        const $form = $("<form>First name</form>")
        const $input = $("<input type='text' name='New Child'>")
        const $button = $("<input type='submit' value='Submit'>")
        $form.append($input)
        $form.append($button)
        $button.click((evt) => {
            evt.preventDefault()
            // Even in this .click(lambda), `this` is the `Gui class` we're
            // defining in this file. So formSubmit() is defined above.
            this.formSubmit($input.val())
        })
        return $form
    }

    renderTree() {
        const treeListItems = this.renderSubtree(this.tree.getRoot())
        const $fullNestedTreeList = $("<ul>").append(treeListItems)
        $("body").empty().append($fullNestedTreeList)
    }

    /**
     * Get jQuery elements describing the tree from a given node, down.
     * @param  {FSTNode}   node the root of the subtree to be rendered
     * @return {$("<li>")} a jquery list item with all its descendents rendered
     * in <ul>'s
     */
    renderSubtree(node) {
        // render this node as a basic list item
        const nodeName = node.isRoot() ? "ROOT" : node.getName()
        const baseHtmlNode = $("<li>").text(nodeName)

        // if this is the node where the cursor is at
        if (node == this.cursor.getNode()) {
            // give it unique styling
            baseHtmlNode.addClass("cursor")
            // give it a form for adding a new child
            baseHtmlNode.append(this.createFormElem())
        } else {
            // otherwise make sure it doesn't look like the cursor node
            baseHtmlNode.removeClass("cursor")
        }

        // If this node is expanded, render its children (and recursively, all
        // its descendants).
        if (node.getData().get("expanded") && node.numChildren() > 0) {
            const $listOfChildren = $("<ul>")
            node.getChildren()
                .forEach(child =>
                    $listOfChildren.append(
                        this.renderSubtree(child)))
            baseHtmlNode.append($listOfChildren)
        }
        // clicking on any node will move the cursor to it
        const $span = $("<button>").text("[focus]").click(() => {
            console.log("clicked to focus on item")
            this.cursor.moveToId(node.getId())
            this.render()
        })
        baseHtmlNode.append($span)
        return baseHtmlNode
    }
}

// create a blank gui
const gui = new Gui()

// render it for visualization and interaction
gui.render()

gui.formSubmit("1st")
gui.formSubmit("2nd")
