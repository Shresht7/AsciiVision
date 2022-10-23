//@ts-check

//  =======
//  LIBRARY
//  =======

import * as CONSTANTS from "./js/constants.js"
import { Video } from "./js/Video.js"
import { Canvas } from "./js/Canvas.js"
import "./js/toggleTheme.js"
import { Renderer } from "./js/Renderer.js"

//  VIDEO
const video = new Video(CONSTANTS.VIDEO)

//  CANVAS
const canvas = new Canvas(CONSTANTS.VIDEO_CANVAS)

//  =====
//  ASCII
//  =====

const renderer = new Renderer()

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
    renderer.updateCharset((charset) => charset.trimEnd() + ' '.repeat(count))
})

// TOGGLE CAMERA BUTTON
// --------------------

const toggleCameraBtn = /** @type HTMLButtonElement */(document.getElementById(CONSTANTS.CTRL_TOGGLE_CAMERA))
toggleCameraBtn.addEventListener('click', video.toggleFacingMode)

// START BUTTON
// ------------

const startBtn = /** @type HTMLButtonElement */(document.getElementById(CONSTANTS.CTRL_START))
startBtn.addEventListener('click', async () => {
    await video.captureStream()
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
    renderer.renderHTML(textElement, canvas.getPixelData())
    requestAnimationFrame(draw)
}
