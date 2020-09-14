const { ipcRenderer } = require("electron")

import { Kinect } from "./kinect.mjs"
const kinect = new Kinect()

import { Templates } from "./buildings-templates.mjs"
const BUILDINGS_DATA_URL = "buildings.json"
const VIDEO_SRC = "/video/plotina.mp4"

async function renderVideo() {
  // document.body.innerHTML = `
  //     <div class="video-container">
  //       <video autoplay="true" muted="muted" loop="true" class="fit-contain" src="${VIDEO_SRC}"></video>
  //     </div>`
}

async function render(detail) {
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

  document.body.innerHTML = Templates[detail](data)
}

ipcRenderer.on("message", (_, {type, detail }) => {
  switch (type) {
    case "content":
      render(detail)
      break

    case "depth":
      kinect.depthFrame(detail)
      break
  }
})

kinect.addEventListener("active", event => {
  console.dir(event)
})

renderVideo()