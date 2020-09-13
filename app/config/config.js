const { screen } = require("electron")
const path = require("path")

const { MACS, IPv4, IPv6 } = require("./platform.js")

class Config {
  static GetDisplays = () =>
    screen.getAllDisplays()
          .sort(({bounds: {x: a}}, {bounds: {x: b}}) => a - b)
          .map(({bounds}, i) => ({...bounds, id: i + 1 }))

  static GetFileConfig = async (cfgPath) => {
    try {
      return require(cfgPath)
    } catch (err) {
      console.error(err)
      return undefined
    }
  }

  static GetConfig = async () => {
    const [,...argv] = process.argv
    const cfgPath = path.resolve(...argv)
    const config = (await this.GetFileConfig(cfgPath)) ?? {
      id: null,
      viewPorts: this.GetDisplays().map(({ id, x, y, width, height }) => ({
        id, x, y, width, height,
        fullscreen: true,
      }))
    }
    return {...config, mac: MACS[0], IPv4: IPv4[0], IPv6: IPv6[0] }
  }

  constructor() { throw new Error("Unconstructable class") }
}

module.exports = { Config }
