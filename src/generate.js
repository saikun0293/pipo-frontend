import Identicon from 'identicon.js'
import { sha256 } from 'js-sha256'

const generateIdenticon = (str) => {
  const hash = sha256(str)
  const options = {
    background: [255, 255, 255, 255],
    foreground: [255, 102, 102, 255],
    size: 420,
    margin: 0.2
  }
  const data = new Identicon(hash, options).toString()
  const src = 'data:image/png;base64,' + data
  return src
}

const timeAgo = (current, previous) => {
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365

  const elapsed = Math.abs(current - previous)

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago'
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago'
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago'
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago'
  }
}

export { generateIdenticon, timeAgo }
