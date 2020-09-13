const TYPES = require("./types.js")
const TYPES_VALUES = Object.values(TYPES)

class Message {
  #from = undefined
  get from() { return this.#from }

  #to = undefined
  get to() { return this.#to }

  #type = undefined
  get type() { return this.#type }

  #detail = undefined
  get detail() { return this.#detail }

  constructor({from, to = null, type, detail}) {
    if (!TYPES_VALUES.includes(type)) {
      throw new Error(`Incorrect message type of "${type}"`)
    }

    this.#from = from
    this.#to = to
    this.#type = type
    this.#detail = detail
  }

  toJSON() {
    return {
      from:   this.#from,
      to:     this.#to,
      type:   this.#type,
      detail: this.#detail,
    }
  }

  toString() {
    JSON.stringify(this)
  }
}

module.exports = { Message }