const { ipcRenderer } = require("electron")

import { Kinect } from "./kinect.mjs"
const kinect = new Kinect()

import { Templates } from "./buildings-templates.mjs"
const BUILDINGS_DATA_URL = "buildings.json"
const VIDEO_SRC = "/video/plotina.mp4"

const throttleDepthFrame = limit => {
  let inThrottle
  return function(detail) {
    if (!inThrottle) {
      kinect.depthFrame(detail)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

const depthFrame = throttleDepthFrame(250)

async function renderVideo() {
  requestAnimationFrame(() => {
    document.body.innerHTML = `
        <div class="video-container">
          <video autoplay="true" loop="true" class="fit-contain" src="${VIDEO_SRC}"></video>
        </div>`
  })
}

let currentDetail = 0
async function render(detail) {
  if (detail === currentDetail) return
  currentDetail = detail

  kinect.visible = false
  if (!detail) return renderVideo()

  const response = await fetch(BUILDINGS_DATA_URL, { cache: "no-cache" })
  const buildingsData = await response.json()
  const data = buildingsData[--detail]

  if (!data) {
    console.error("Incorrect ID")
    document.body.innerHTML = "ERROR: Incorrect ID"
    return
  }
  requestAnimationFrame(() => {
    document.body.innerHTML = Templates[detail](data)
  })
}

ipcRenderer.on("message", (_, {type, detail }) => {
  switch (type) {
    case "content":
      render(detail)
      break

    case "depth":
      depthFrame(detail)
      break
  }
})

kinect.addEventListener("active", ({detail}) => {
  render(detail)
})

renderVideo()