const { Message } = require("./message.js")

const ALL_EVENTS = Symbol("ALL_EVENTS")

class EventBus {
  static instance = new EventBus()

  constructor() {
    return EventBus.instance ?? this
  }

  #listeners = { [ALL_EVENTS]: [] }

  on = (name = ALL_EVENTS, callback) => this.#listeners[name] = [...(this.#listeners[name] ?? []), callback]
  off = (name = "*", callback) => this.#listeners[name] = (this.#listeners[name] ?? []).filter(cb => cb !== callback)

  emit = (type, { from, to = null, detail }) => {
    const message = new Message({from, to, type, detail})
    this.#listeners[ALL_EVENTS].forEach(cb => cb(message))
    ;(this.#listeners[type] ?? []).forEach(cb => cb(message))
  }
}

module.exports = { EventBus }
