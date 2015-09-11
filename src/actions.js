class Actions {

  constructor (tree) {
    this.actions = {}
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
