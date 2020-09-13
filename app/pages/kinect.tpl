<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Display ${$.index}</title>
  <style type="text/css">
    html, body. div, span {
      display: block;
      box-sizing: border-box;
      overflow: hidden;
    }

    html, body {
      width: 100vw;
      height: 100vh;
    }

    body {
      margin: 0;
      display: grid;
      justify-content: center;
      align-content: center;
      background: rgb(255 255 255);
    }

    .depth-canvas {
      --width: 512;
      --height: 424;
      display: block;
      position: fixed;
      left: calc(50vw - var(--width) * 1px / 2);
      top: calc(50vh - var(--height) * 1px / 2);
      width: calc(var(--width) * 1px);
      height: calc(var(--height) * 1px);
    }
  </style>
</head>
<body>
  <canvas class="depth-canvas"></canvas>
  <script type="text/javascript">
    const { ipcRenderer } = require("electron")

    const WIDTH = 512
    const HEIGHT = 424
    const MAX_DEPTH = 4500

    const LOG_LENGTH = 30

    new (class Depth {
      #canvas = document.querySelector("canvas")
      #ctx = this.#canvas.getContext("2d")
      #imageData = this.#ctx.createImageData(WIDTH, HEIGHT)
      #pixelArray = this.#imageData.data
      #imageDataSize = this.#pixelArray.length

      #logData = new Array(LOG_LENGTH)

      constructor() {
        this.#canvas.width = WIDTH
        this.#canvas.height = HEIGHT
        this.#canvas.classList.add("depth-canvas")
        this.#canvas.style.setProperty("--width", WIDTH)
        this.#canvas.style.setProperty("--height", HEIGHT)
        ipcRenderer.on("message", this.#onDepth)
        window.addEventListener("keydown", this.#keydown)
      }

      #onDepth = (_, {detail: {depth}}) => {
        this.#render(depth)
        this.#log(depth)
      }

      #render = depth => {
        let depthPixelIndex = 0
        for (let i = 0; i < this.#imageDataSize; i+=4) {
          const value = depth[depthPixelIndex] ?? 0
          depthPixelIndex++

          const gray = value / MAX_DEPTH * 255
          this.#pixelArray[i] = gray
          this.#pixelArray[i+1] = gray
          this.#pixelArray[i+2] = gray
          this.#pixelArray[i+3] = 0xff
        }
        requestAnimationFrame(() => this.#ctx.putImageData(this.#imageData, 0, 0))
      }

      #log = depth => {
        this.#logData.shift()
        this.#logData.push(depth)
      }

      #save = () => {
        const a = document.createElement("a")
        const file = new Blob([JSON.stringify(this.#logData)], {type: "text/plain"})
        a.href = URL.createObjectURL(file)
        a.download = "log.json";
        a.click()
      }

      #keydown = event => {
        switch(event.key.toUpperCase()) {
          case "S":
            this.#save()
            break

          default:
            return
        }

        event.preventDefault()
        event.stopPropagation()
      }
    })()
  </script>
</body>
</html>
