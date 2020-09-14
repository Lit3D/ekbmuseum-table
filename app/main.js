const { app, BrowserWindow, powerSaveBlocker, globalShortcut, dialog, ipcMain } = require("electron")
const WINDOW_OPTIONS = require("./window-options.js")

const { DISPLAY, KINECT } = require("./pages/index.js")
const { Config } = require("./config/config.js")
const { EventBus } = require("./event-bus/event-bus.js")
const { Kinect } = require("./kinect/kinect.js")
const { ContentServer, CONTENT_SERVER_PORT } = require("./content-server.js")

const eventBus = new EventBus()
new Kinect()
new ContentServer()

const REMOTE_DEBUGGING_PORT = 1337
const CHESS_BOARD_TIMEOUT = 3 * 1000 // 30s

// Suppress error dialogs by overriding
dialog.showErrorBox = (title, content) => console.error(`${title}\n${content}`)

const powerSaveID = powerSaveBlocker.start("prevent-display-sleep")

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required")
app.commandLine.appendSwitch("disable-http2")
app.commandLine.appendSwitch("disable-renderer-backgrounding")
app.commandLine.appendSwitch("enable-accelerated-mjpeg-decode")
app.commandLine.appendSwitch("enable-accelerated-video")
app.commandLine.appendSwitch("enable-gpu-rasterization")
app.commandLine.appendSwitch("enable-native-gpu-memory-buffers")
app.commandLine.appendSwitch("enable-oop-rasterization")
app.commandLine.appendSwitch("enable-zero-copy")
app.commandLine.appendSwitch("force-device-scale-factor", "1")
app.commandLine.appendSwitch("high-dpi-support", "1")
app.commandLine.appendSwitch("ignore-certificate-errors")
app.commandLine.appendSwitch("ignore-connections-limit", `localhost`)
app.commandLine.appendSwitch("ignore-gpu-blacklist")
app.commandLine.appendSwitch("no-proxy-server")
app.commandLine.appendSwitch("process-per-tab")
app.commandLine.appendSwitch("remote-debugging-port", String(REMOTE_DEBUGGING_PORT))

app.on("ready", main)
app.on("window-all-closed", exit)

let windows = []

function exit() {
  windows.forEach(w => w.close())
  powerSaveBlocker.stop(powerSaveID)
  app.exit()
}

function reload() {
  windows.forEach(w => w.webContents.reloadIgnoringCache())
} 

let allowClient = true

function urls() {
  allowClient = false
  windows.forEach(w => w.loadURL("chrome://chrome-urls/"))
}

function gpu() {
  allowClient = false
  windows.forEach(w => w.loadURL("chrome://gpu/"))
}

function kinect() {
  allowClient = false
  windows.forEach(w => w.loadURL(KINECT({})))
}

async function initViewPorts({mac, IPv4, IPv6, viewPorts}) {
  for (const {id, x, y, width, height, fullscreen} of viewPorts) {

    const position =  fullscreen ? {
                        x: x + width / 4,
                        y: y + height / 4,
                        width: width / 2,
                        height: height / 2,
                      } : {
                        x, y, width, height,
                      }

    let win = new BrowserWindow({
      ...WINDOW_OPTIONS,
      ...position,
      fullscreen, kiosk: fullscreen,
    })

    win.on("closed", () => {
      windows = windows.filter(w => w !== win)
      win = null
    })

    win.removeMenu()
    !fullscreen && win.setSize(width, height)

    win.loadURL(DISPLAY({x, y, width, height, id: id , mac, IPv4, IPv6 }))
    const url = `http://localhost:${CONTENT_SERVER_PORT}/${id}.html`
    setTimeout(() => allowClient && win && win.loadURL(url), CHESS_BOARD_TIMEOUT)
    
    win.show()
    windows.push(win)

    eventBus.on(undefined, message => {
      if (!win) return
      if (message.to && message.to !== id) return
      win.webContents.send("message", message.toJSON())
    })
    //win.webContents.openDevTools()
  }
}

async function initIPC() {
  ipcMain.on("message", (_, message) => {
    const { from, to, type, detail } = message
    eventBus.emit(type, {from, to, detail})
  })
}

async function initGlobalShortcut() {
  globalShortcut.register("CommandOrControl+G", gpu)
  globalShortcut.register("CommandOrControl+K", kinect)
  globalShortcut.register("CommandOrControl+Q", exit)
  globalShortcut.register("CommandOrControl+U", urls)
  globalShortcut.register("F5", reload)
}

async function main() {
  const config = await Config.GetConfig()
  await initViewPorts(config)
  await initIPC()
  await initGlobalShortcut()
}
