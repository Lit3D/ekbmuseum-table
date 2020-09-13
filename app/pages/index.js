const { readdirSync, readFileSync } = require("fs")
const path = require("path")

const Template = HTML => {
  const Fn = new Function("$", `return \`${HTML}\``)
  return data => "data:text/html;charset=UTF-8," + encodeURIComponent(Fn(data))
}

module.exports = readdirSync(__dirname)
                  .map(file => path.resolve(__dirname, file))
                  .map(full => ({...path.parse(full), full}))
                  .filter(({ext}) => ext === ".tpl")
                  .reduce((acc, {name, full}) => {
                    return {
                      ...acc,
                      [name.toUpperCase()]: Template(readFileSync(full))
                    }
                  }, {})
