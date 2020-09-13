const fs = require("fs")
const path = require("path")
const http = require("http")

const CONTENT_SERVER_PORT = 8080
const CONTENT_DIR = "./content"

const MIME = {
  ".css"   : "text/css",
  ".html"  : "text/html",
  ".jpeg"  : "image/jpeg",
  ".jpg"   : "image/jpeg",
  ".js"    : "text/javascript",
  ".json"  : "application/json",
  ".mjs"   : "text/javascript",
  ".svg"   : "image/svg+xml",
  ".txt"   : "text/plain",
  ".webm"  : "video/webm",
  ".webp"  : "image/webp",
  ".woff"  : "font/woff",
  ".woff2" : "font/woff2",
}

class ContentServer {

  #resolvedBase = undefined
  #server = undefined

  constructor(contentPat = CONTENT_DIR) {
    this.#resolvedBase = path.resolve(contentPat)
    this.#server = http.createServer(this.#handler)
    this.#server.listen(CONTENT_SERVER_PORT)
  }

  #handler = (req, res) => {
    if (req.method !== "GET") {
      res.writeHead(405, "Not Allowed")
      res.write("405: Method Not Allowed")
      res.end()
      return
    }

    const filePath = path.join(this.#resolvedBase, path.normalize(req.url))
    const extname = path.extname(filePath)
    const stream = fs.createReadStream(filePath)

    stream.on("error", err => {
      console.error(`[CONTENT] Get file error: ${err}`)
      res.writeHead(404, "Not Found")
      res.write("404: File Not Found")
      res.end()
    })

    res.writeHead(200, { "Content-Type": MIME[extname] ?? "application/octet-stream" })
    stream.pipe(res)
  }
}

module.exports = { ContentServer, CONTENT_SERVER_PORT }
