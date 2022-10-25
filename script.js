//@ts-check

//  =======
//  LIBRARY
//  =======

import * as CONSTANTS from "./modules/constants.js"
import { Video } from "./modules/Video.js"
import { Canvas } from "./modules/Canvas.js"
import "./modules/toggleTheme.js"
import { Renderer, HTMLRenderer, CanvasRenderer } from "./modules/Renderer.js"

//  VIDEO
const video = new Video(CONSTANTS.VIDEO)

//  CANVAS
const videoCanvas = new Canvas(CONSTANTS.VIDEO_CANVAS)

//  =====
//  ASCII
//  =====


const html = /** @type HTMLDivElement */ (document.getElementById(CONSTANTS.ASCII_VIDEO))
const canvas = /** @type HTMLCanvasElement */ (document.getElementById(CONSTANTS.ASCII_CANVAS))
// const renderer = new HTMLRenderer(html)
const renderer = new CanvasRenderer(canvas)

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
    videoCanvas.render(video.element)
    renderer.render(videoCanvas.getPixelData())
    requestAnimationFrame(draw)
}
