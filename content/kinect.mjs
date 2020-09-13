
const WIDTH = 512
const HEIGHT = 424

const MIN_DEPTH = 0
const MAX_DEPTH = 4500

export class Kinect {
  #frames = []

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
  }

  #training = depth => {
    for (let i = 0, l = depth.length; i < l; i++) {
      const prev = this.#etalon[i] ?? 0
      const curr = depth[i]
      //console.log(prev, curr)
      if (prev > 0 && curr > 0) {
        this.#etalon[i] = (prev + curr) / 2
        return
      }

      this.#etalon[i] = curr
    }
    //console.log(this.#etalon)
  }

  #render = depth => {
    let depthPixelIndex = 0
    for (let i = 0; i < this.#imageDataSize; i+=4) {
      const value = this.#etalon[depthPixelIndex] ?? 0
      depthPixelIndex++

      const gray = value / MAX_DEPTH * 255
      this.#pixelArray[i] = gray
      this.#pixelArray[i+1] = gray
      this.#pixelArray[i+2] = gray
      this.#pixelArray[i+3] = 0xff
    }
    requestAnimationFrame(() => this.#ctx.putImageData(this.#imageData, 0, 0))
  }

  depthFrame = ({depth}) => {
    this.#training(depth)
    if (this.#visible) this.#render(depth)
  }

  #keydown = event => {
    switch(event.key.toUpperCase()) {
      case "K":
        this.visible = !this.visible
        break

      default:
        return
    }

    event.preventDefault()
    event.stopPropagation()
  }

}
