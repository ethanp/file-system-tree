## An ES6 class structured like a file system

* See usage example [here](example/usage.js)
* See unit tests [here](test/CursorSpec.js)

### TODOs

* Fill out [`example/usage.js`](example/usage.js)
* Fill out tests

### Ideas

This is like a list of intents

#### Setting Workspace
* 'SET_ROOT_NODE'

#### Related to changing viewing of tree
* 'TOGGLE_CHILDREN_HIDDEN'

#### Related to user's cursor location in tree.
* 'MOVE_THISUSER_CURSOR' (e.g. in/out of a directory, cd)
* 'SET_THISUSER_CURSOR' (cd)
* 'GET_THISUSER_CURSOR' (pwd)
* 'RESET_THISUSER_CURSOR' (cd ~)

#### Changes to Tree
* 'UPDATE_NODE' (vim)
* 'MOVE_NODE' (mv)
* 'DELETE_NODE' (rm)
* 'CREATE_NODE' (touch)

#### Node Properties
* 'SYMLINK_NODE' (ln -s)

#### Node Get
* 'LIST_CHILDREN' (ls)
* 'GET_NODE' (cat)

