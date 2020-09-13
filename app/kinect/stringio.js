
async function* chunksToLinesAsync(chunks) {
  if (!Symbol.asyncIterator) {
    throw new Error("Current JavaScript engine does not support asynchronous iterables")
  }
  if (!(Symbol.asyncIterator in chunks)) {
    throw new Error("Parameter is not an asynchronous iterable")
  }

  let previous = ''

  for await (const chunk of chunks) {
    previous += chunk
    let eolI
    while ((eolI = previous.indexOf("\n")) >= 0) {
      const line = previous.slice(0, eolI + 1)
      yield line
      previous = previous.slice(eolI + 1)
    }
  }

  if (previous.length > 0) yield previous
}

const NEWLINE = /\r?\n$/u
function chomp(line) {
  const match = NEWLINE.exec(line)
  return match ? line.slice(0, match.index) : line
}

module.exports = { chunksToLinesAsync, chomp }