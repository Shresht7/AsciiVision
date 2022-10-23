//  =======
//  LIBRARY
//  =======

import * as CONSTANTS from "./js/constants.js"
import { Video } from "./js/Video.js"
import { Canvas } from "./js/Canvas.js"
import "./js/toggleTheme.js"

//  VIDEO
//  -----

const video = new Video(CONSTANTS.VIDEO)

//  ========
//  CONTROLS
//  ========

const toggleCameraButton = document.getElementById(CONSTANTS.CTRL_TOGGLE_CAMERA)
toggleCameraButton.addEventListener('click', video.toggleFacingMode)

/** @type HTMLButtonElement */
const startBtn = document.getElementById(CONSTANTS.CTRL_START)
/** @type HTMLButtonElement */
const stopBtn = document.getElementById(CONSTANTS.CTRL_STOP)

startBtn.addEventListener('click', () => {
    video.captureStream()
})

stopBtn.addEventListener('click', () => {
    video.pause()
})

//  CANVAS
//  ------

const canvas = new Canvas(CONSTANTS.VIDEO_CANVAS)

//  =====
//  ASCII
//  =====

let CHARSET = "█▓▒Ñ@#W$9876543210?!abc;:+=-,._ ";
// const CHARSET = '       .:-i|=+%O#@'
// const CHARSET = '        .:░▒▓█';

const slider = document.getElementById(CONSTANTS.CTRL_SENSITIVITY_SLIDER)

slider.addEventListener('input', (e) => {
    CHARSET = CHARSET.trimEnd() + ' '.repeat(e.target.value + 1)
})

const getChar = (scale) => {
    const val = Math.floor((scale / 255) * (CHARSET.length - 1))
    let char = CHARSET[val]
    if (char === " ") { return "&nbsp;" } else { return char }
}

function renderText(node, data) {
    let txt = `<div>`
    for (const row of data) {
        for (const entry of row) {
            const [r, g, b, a] = entry
            const average = (r + g + b) / 3
            txt += getChar(average)
        }
        txt += `<br />`
    }
    txt += `</div>`
    node.innerHTML = txt
}

const textElement = document.getElementById(CONSTANTS.ASCII_VIDEO)

//  ====
//  DRAW
//  ====

function draw() {
    if (video.element.paused) { return }
    canvas.render(video.element)
    const data = canvas.getPixelData()
    renderText(textElement, data)
    requestAnimationFrame(draw)
}
