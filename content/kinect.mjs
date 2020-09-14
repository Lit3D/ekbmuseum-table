
const WIDTH = 512
const HEIGHT = 424

const MIN_DEPTH = 0
const MAX_DEPTH = 4500
const MIN_SENSE = 5
const MAX_SENSE = 10

const FRAME_SIZE = 100

const DATA_URL = "kinect.json"

class Frame {
  #action = undefined
  #x = 0
  #y = 0
  #w = 0
  #h = 0

  #selected = false
  get selected() { return this.#selected }
  select = () => this.#selected = true
  unselect = () => this.#selected = false

  constructor([x = 0, y = 0, w = FRAME_SIZE, h = FRAME_SIZE, action = -1] = []){
    this.#x = x
    this.#y = y
    this.#w = w
    this.#h = h
    this.#action = action
  }

  border(x, y) {
    const x1 = this.#x
    const y1 = this.#y
    const x2 = this.#x + this.#w
    const y2 = this.#y + this.#h
    if (x === x1 && y >= y1 && y <= y2) return true
    if (x === x2 && y >= y1 && y <= y2) return true
    if (y === y1 && x >= x1 && x <= x2) return true
    if (y === y2 && x >= x1 && x <= x2) return true
    return false
  }

  point(x, y) {
    const x1 = this.#x
    const y1 = this.#y
    const x2 = this.#x + this.#w
    const y2 = this.#y + this.#h
    return x >= x1 && x <= x2 && y >= y1 && y <= y2
  }

  toJSON() {
    return [this.#x, this.#y, this.#w, this.#h, this.#action]
  }

  keydown = event => {
    if (!this.#selected) return
    switch(event.key.toUpperCase()) {
      case "A":
        // Action
        break

      case "ARROWUP":
        if (event.shiftKey) {
          this.#h = this.#h - 1
          break
        }
        this.#y = this.#y - 1
        break
      case "ARROWDOWN":
        if (event.shiftKey) {
          this.#h = this.#h + 1
          break
        }
        this.#y = this.#y + 1
        break
      case "ARROWLEFT":
        if (event.shiftKey) {
          this.#w = this.#w - 1
          break
        }
        this.#x = this.#x - 1
        break
      case "ARROWRIGHT":
        if (event.shiftKey) {
          this.#w = this.#w + 1
          break
        }
        this.#x = this.#x + 1
        break

      default:
        return
    }

    event.preventDefault()
    event.stopPropagation()
  }
}

export class Kinect {

  #corners = [0,0,WIDTH,HEIGHT]

  #min_depth = MIN_DEPTH
  #max_depth = MAX_DEPTH

  #min_sens = MIN_SENSE
  #max_sens = MAX_SENSE

  #frames = []
  get isFrameActive() { return this.#frames.some(f => f.selected) }

  addFrame() {
    const frame = new Frame()
    window.addEventListener("keydown", frame.keydown)
    frame.select()
    this.#frames.forEach(f => f.unselect())
    this.#frames = [...this.#frames, frame]
  }

  delFrame() {
    const frame = this.#frames.find(f => f.selected)
    if (!frame) return
    window.removeEventListener("keydown", frame.keydown)
    this.#frames = this.#frames.filter(f => f !== frame)
  }

  #canvas = document.createElement("canvas")
  #ctx = this.#canvas.getContext("2d")
  #imageData = this.#ctx.createImageData(WIDTH, HEIGHT)
  #pixelArray = this.#imageData.data
  #imageDataSize = this.#pixelArray.length

  #etalon = new Array(WIDTH * HEIGHT).fill(0)

  #visible = false
  get visible() {
    return this.#visible
  }
  set visible(value) {
    if (value && !this.#visible) {
      document.body.appendChild(this.#canvas)
    } else if (!value && this.#visible) {
      document.body.removeChild(this.#canvas)
    }

    this.#visible = value
  }

  constructor() {
    this.#canvas.classList.add("depth-canvas")
    this.#canvas.width = WIDTH
    this.#canvas.height = HEIGHT
    window.addEventListener("keydown", this.#keydown)
    setTimeout(() => this.#trainingMode = false, 10 * 1000) // 30 sec
    this.#load()
  }

  #trainingMode = true
  #training = depth => {
    this.#etalon = this.#etalon.map((a, i) => {
      const b = depth[i] ?? 0
      if (a > 0 && b > 0) return Math.round((a + b) / 2)
      if (b > 0) return b
      return a
    })
  }

  #render = depth => {
    if (!this.#visible) return

    let depthPixelIndex = 0
    const [ x1, y1, x2, y2 ] = this.#corners
    const depthZone = this.#max_depth - this.#min_depth

    pointsLoop:
    for (let i = 0; i < this.#imageDataSize; i+=4) {
      const y = Math.floor(depthPixelIndex / 512)
      const x = depthPixelIndex - y * 512
      const value = depth[depthPixelIndex] ?? 0
      const etalon = this.#etalon[depthPixelIndex] ?? 0
      depthPixelIndex++

      // Global borders
      if (x === x1 || x === x2 || y === y1 || y === y2) {
        this.#pixelArray[i  ] = 0x00
        this.#pixelArray[i+1] = 0x00
        this.#pixelArray[i+2] = 0xff
        this.#pixelArray[i+3] = 0xff
        continue
      }

      // Frames
      for (const frame of this.#frames) {
        if (frame.border(x,y)) {
          this.#pixelArray[i  ] = frame.selected ? 0xff : 0x00
          this.#pixelArray[i+1] = frame.selected ? 0x00 : 0xff
          this.#pixelArray[i+2] = 0x00
          this.#pixelArray[i+3] = 0xff
          continue pointsLoop
        }

        if (frame.point(x,y)) {
          const dd = etalon - value
          console.log(dd)
          if (dd > 0 && dd < 10) {
            this.#pixelArray[i  ] = 0xff
            this.#pixelArray[i+1] = 0x00
            this.#pixelArray[i+2] = 0x00
            this.#pixelArray[i+3] = 0xff
            continue pointsLoop
          }
        }
      }

      // Search depth
      if (value < this.#min_depth || value > this.#max_depth) {
        this.#pixelArray[i  ] = 0x00
        this.#pixelArray[i+1] = 0x00
        this.#pixelArray[i+2] = 0x00
        this.#pixelArray[i+3] = 0xff
        continue
      }

      const gray = (value - this.#min_depth) / depthZone * 255
      //const gray = value / MAX_DEPTH * 255
      this.#pixelArray[i] = gray
      this.#pixelArray[i+1] = gray
      this.#pixelArray[i+2] = gray
      this.#pixelArray[i+3] = 0xff
    }
    requestAnimationFrame(() => this.#ctx.putImageData(this.#imageData, 0, 0))
  }

  depthFrame = ({depth}) => {
    if (this.#trainingMode) {
      this.#training(depth)
      this.#render(this.#etalon)
      return
    }

    this.#render(depth)
  }

  toJSON() {
    return {
      corners: this.#corners,
      min_depth: this.#min_depth,
      max_depth: this.#max_depth,
      frames: this.#frames.map(f => f.toJSON())
    }
  }

  #save = () => {
    const a = document.createElement("a")
    const file = new Blob([JSON.stringify(this.toJSON())], {type: "text/plain"})
    a.href = URL.createObjectURL(file)
    a.download = "log.json";
    a.click()
  }

  #load = async () => {
    let data
    try {
      const response = await fetch(DATA_URL, { cache: "no-cache" })
      data = await response.json()
    } catch (err) {
      console.error(err)
      return
    }
    this.#corners = data.corners ?? [0,0,WIDTH,HEIGHT]
    this.#min_depth = data.min_depth ?? MIN_DEPTH
    this.#max_depth = data.max_depth ?? MAX_DEPTH
    if (Array.isArray(data.frames))
      this.#frames = data.frames.map(f => {
        const frame = new Frame(f)
        window.addEventListener("keydown", frame.keydown)
        return frame
      })
    else
      this.#frames = []
  }

  #keydown = event => {
    let i
    switch(event.key.toUpperCase()) {
      case "K":
        this.visible = !this.visible
        break

      case "T":
        this.#trainingMode = !this.#trainingMode
        break

      case "S":
        this.#save()
        break

      case "L":
        this.#load()
        break

      case "N":
        if (!this.#visible) break
        this.addFrame()
        break

      case "D":
        if (!this.#visible) break
        this.delFrame()
        break

      case ">":
        if (!this.#visible) break
        if (this.#frames.length === 0) break
        i = this.#frames.findIndex(f => f.selected) + 1
        if (i >= this.#frames.length) i = 0
        this.#frames.forEach(f => f.unselect())
        this.#frames[i].select()
        break

      case "<":
        if (!this.#visible) break
        if (this.#frames.length === 0) break
        i = this.#frames.findIndex(f => f.selected) - 1
        if (i < 0) i = this.#frames.length - 1
        this.#frames.forEach(f => f.unselect())
        this.#frames[i].select()
        break

      case "ESCAPE":
        if (!this.#visible) break
        this.#frames.forEach(f => f.unselect())
        break

      case "]":
        if (!this.#visible) break
        this.#min_depth = this.#min_depth + 10
        break

      case "[":
        if (!this.#visible) break
        this.#min_depth = this.#min_depth - 10
        break

      case "}":
        if (!this.#visible) break
        this.#max_depth = this.#max_depth + 10
        break

      case "{":
        if (!this.#visible) break
        this.#max_depth = this.#max_depth - 10
        break

      case "ARROWUP":
        if (!this.#visible) break
        if (this.isFrameActive) break
        if (event.shiftKey) {
          this.#corners[3] = this.#corners[3] - 1
          break
        }
        this.#corners[1] = this.#corners[1] - 1
        break
      case "ARROWDOWN":
        if (!this.#visible) break
        if (this.isFrameActive) break
        if (event.shiftKey) {
          this.#corners[3] = this.#corners[3] + 1
          break
        }
        this.#corners[1] = this.#corners[1] + 1
        break
      case "ARROWLEFT":
        if (!this.#visible) break
        if (this.isFrameActive) break
        if (event.shiftKey) {
          this.#corners[2] = this.#corners[2] - 1
          break
        }
        this.#corners[0] = this.#corners[0] - 1
        break
      case "ARROWRIGHT":
        if (!this.#visible) break
        if (this.isFrameActive) break
        if (event.shiftKey) {
          this.#corners[2] = this.#corners[2] + 1
          break
        }
        this.#corners[0] = this.#corners[0] + 1
        break

      default:
        return
    }

    event.preventDefault()
    event.stopPropagation()
  }

}
