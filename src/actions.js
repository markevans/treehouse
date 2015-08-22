class Actions {

  constructor () {
    this.actions = {}
    this.state = null
  }

  setState (state) {
    this.state = state
  }

  registerActions (actions) {
    Object.assign(this.actions, actions)
  }

  call (name, payload={}) {
    if ( this.actions[name] ) {
      this.actions[name](this.state.at(), payload, this.state.commit.bind(this.state))
    } else {
      console.log(`Action '${name}' not found`)
    }
  }

}

export default Actions
