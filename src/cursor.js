class Cursor {
  constructor (tree, path=[]) {
    this.tree = tree
    this.path = path
  }

  get () {
    return this.tree.TODO
  }

  set (value) {
    this.tree.TODO
  }
}

export default Cursor
