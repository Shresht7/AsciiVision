//@ts-check

//  =======
//  LIBRARY
//  =======

import * as CONSTANTS from "./js/constants.js"
import { Video } from "./js/Video.js"
import { Canvas } from "./js/Canvas.js"
import "./js/toggleTheme.js"

//  VIDEO
const video = new Video(CONSTANTS.VIDEO)

//  CANVAS
const canvas = new Canvas(CONSTANTS.VIDEO_CANVAS)

//  =====
//  ASCII
//  =====

let CHARSET = "█▓▒Ñ@#W$9876543210?!abc;:+=-,._ ";
// const CHARSET = '       .:-i|=+%O#@'
// const CHARSET = '        .:░▒▓█';

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

const textElement = /** @type HTMLDivElement */ (document.getElementById(CONSTANTS.ASCII_VIDEO))

// ========
// CONTROLS
// ========

// SENSITIVITY SLIDER
// ------------------

const slider = /** @type HTMLInputElement */ (document.getElementById(CONSTANTS.CTRL_SENSITIVITY_SLIDER))

slider.addEventListener('input', (e) => {
    const target = /** @type HTMLInputElement  */ (e.target)
    const count = parseInt(target.value) + 1
    CHARSET = CHARSET.trimEnd() + ' '.repeat(count)
})

// TOGGLE CAMERA BUTTON
// --------------------

const toggleCameraBtn = /** @type HTMLButtonElement */(document.getElementById(CONSTANTS.CTRL_TOGGLE_CAMERA))
toggleCameraBtn.addEventListener('click', video.toggleFacingMode)

// START BUTTON
// ------------

const startBtn = /** @type HTMLButtonElement */(document.getElementById(CONSTANTS.CTRL_START))
startBtn.addEventListener('click', () => {
    video.captureStream()
    draw()
})

// STOP BUTTON
// -----------

const stopBtn = /** @type HTMLButtonElement */(document.getElementById(CONSTANTS.CTRL_STOP))
stopBtn.addEventListener('click', () => video.pause())

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
