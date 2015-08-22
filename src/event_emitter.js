class Subscription {
  constructor (eventEmitter, eventName, callback) {
    this.eventEmitter = eventEmitter
    this.eventName = eventName
    this.callback = callback
  }

  unsubscribe () {
    this.eventEmitter.off(this.eventName, this.callback)
  }
}

class EventEmitter {
  constructor () {
    this.channels = {}
  }

  on (eventName, callback) {
    this.channel(eventName).push(callback)
    return new Subscription(this, eventName, callback)
  }

  off (eventName, callback) {
    let channel = this.channel(eventName),
        i = channel.indexOf(callback)
    channel.splice(i,1)
  }

  emit (eventName, payload) {
    this.channel(eventName).forEach((callback) =>
      callback(payload)
    )
  }

  channel (eventName) {
    if (!this.channels[eventName]) {
      this.channels[eventName] = []
    }
    return this.channels[eventName]
  }
}

export default EventEmitter
