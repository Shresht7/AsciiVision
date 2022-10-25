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
/** @type {Renderer} */
let renderer = new CanvasRenderer(canvas)

/**
 * Select the Renderer
 * @param {'canvas' | 'html' | 'text'} option Renderer Modes
 */
function selectRenderer(option) {
    if (renderer.type === option) { return }
    renderer.clean()
    switch (option) {
        case 'canvas': renderer = new CanvasRenderer(canvas); break;
        case 'html': renderer = new HTMLRenderer(html); break;
        case 'text': renderer = new HTMLRenderer(html); break;
        default: renderer = new CanvasRenderer(canvas);
    }
}

// ========
// CONTROLS
// ========

//  RENDERER SELECT
//  ---------------

const rendererSelection = /** @type HTMLSelectElement */ (document.getElementById(CONSTANTS.CTRL_RENDERER_SELECT))

rendererSelection.addEventListener('input', (e) => {
    const target = /** @type HTMLSelectElement */ (e.target)
    const value = /** @type { 'canvas' | 'html' | 'text' } */ (target.value)
    selectRenderer(value)
})

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
