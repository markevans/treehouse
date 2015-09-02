class Actions {

  constructor () {
    this.actions = {}
    this.tree = null
  }

  setTree (tree) {
    this.tree = tree
  }

  register(actions) {
    Object.assign(this.actions, actions)
  }

  do (name, payload={}) {
    if ( this.actions[name] ) {
      this.actions[name](this.tree.at(), payload, this.tree.commit.bind(this.tree))
    } else {
      console.log(`Action '${name}' not found`)
    }
  }

}

export default Actions
