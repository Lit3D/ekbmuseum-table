const { arch, cpus, hostname, platform, type, release, totalmem, networkInterfaces }  = require("os")

const GetNetworks = () =>
  Object.entries(networkInterfaces())
        .flatMap(([name, obj]) => obj ? obj.map(v => ({...v, name})) : [])
        .filter(({internal}) => !internal)
        .map(({mac, internal, ...obj}) => ({...obj, mac: mac.replace(/[^0-9a-f]+/ig,"").toLowerCase()}))

const ARCH = arch()
const CPUS = cpus().map(({model}) => model)
const HOSTNAME = hostname()
const NETWORKS = GetNetworks()
const MACS = NETWORKS.map(({mac}) => mac).filter((v, i, arr) => arr.indexOf(v) === i)
const IPv4 = NETWORKS.filter(({family}) => family === "IPv4").map(({address}) => address).filter((v, i, arr) => arr.indexOf(v) === i)
const IPv6 = NETWORKS.filter(({family}) => family === "IPv6").map(({address}) => address).filter((v, i, arr) => arr.indexOf(v) === i)
const OS = `${type()} ${release()}`
const PLATFORM = platform()
const RAM = totalmem()

module.exports = { ARCH, CPUS, HOSTNAME, MACS, NETWORKS, IPv4, IPv6, OS, PLATFORM, RAM }
