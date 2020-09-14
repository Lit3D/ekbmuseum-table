module.exports = {
  center: false,

  closable: false,
  frame: false,
  maximizable: false,
  minimizable: false,
  movable: false,
  resizable: false,
  thickFrame: false,

  autoHideMenuBar: true,
  enableLargerThanScreen: true,
  fullscreenable: true,
  skipTaskbar: true,
  
  backgroundColor: "#ffffff",
  titleBarStyle: "hidden",

  webPreferences: {
  	defaultEncoding: "utf8",

  	devTools: false,
    nodeIntegration: true,
    nodeIntegrationInWorker: false,
    nodeIntegrationInSubFrames: false,
    enableRemoteModule: false,

    backgroundThrottling: false,
    spellcheck: false,

    worldSafeExecuteJavaScript: true,
  },
}
