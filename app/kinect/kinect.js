const { spawn } = require("child_process")
const path = require("path")

const { chunksToLinesAsync, chomp } = require("./stringio.js")
const { EventBus } = require("../event-bus/event-bus.js")

const NM_NAME = "NativeMessaging.exe"
const NM_PATH = path.resolve(__dirname, NM_NAME)

class Kinect {
  static instance = new Kinect()

  #source = null
  #eb = new EventBus()

  constructor() {
    if (Kinect.instance) return Kinect.instance
    this.start()
  }

  start = async () => {
    console.log(`Kinect NativeMessaging starting: ${NM_PATH}`)
    this.#source = spawn(NM_PATH, { stdio: ["ignore", "pipe", process.stderr] })

    this.#source.on("close", this.restart)
    this.#source.on("exit", this.restart)
    this.#source.on("disconnect", this.restart)
    this.#source.on("error", this.restart)

    await this.readMessages(this.#source.stdout)
    this.restart()
  }

  stop = async () => {
    console.log(`Kinect NativeMessaging stoping: ${NM_PATH}`)
    this.#source.kill("SIGHUP")
    this.#source = null
  }

  restart = async () => {
    this.stop()
    this.start()
  }

  readMessages = async (readable) => {
    for await (const line of chunksToLinesAsync(readable)) {
      let detail
      try {
        detail = JSON.parse(chomp(line))
      } catch(err) {
        console.error("Incorrect Kinect message")
      }
      if (!detail) continue
      this.#eb.emit("depth", { from: "kinect", detail })
    }
  }
}

module.exports = { Kinect }
