//@ts-check

//  =======
//  LIBRARY
//  =======

import * as CONSTANTS from "./modules/constants.js"
import { Video } from "./modules/Video.js"
import { Canvas } from "./modules/Canvas.js"
import { Renderer, HTMLRenderer, CanvasRenderer } from "./modules/Renderer.js"

//  =====
//  VIDEO
//  =====

const video = new Video(CONSTANTS.VIDEO)
const videoCanvas = new Canvas(CONSTANTS.VIDEO_CANVAS)

//  =====
//  ASCII
//  =====


const html = /** @type HTMLDivElement */ (document.getElementById(CONSTANTS.ASCII_VIDEO))
const canvas = /** @type HTMLCanvasElement */ (document.getElementById(CONSTANTS.ASCII_CANVAS))

/** @type {Renderer} */
let renderer = new CanvasRenderer(canvas)

/**
 * Select the Renderer
 * @param {'canvas' | 'html' | 'text'} option Renderer Modes
 */
export function selectRenderer(option) {
    if (renderer.type === option) { return }
    renderer.clean()
    switch (option) {
        case 'canvas': renderer = new CanvasRenderer(canvas); break;
        case 'html': renderer = new HTMLRenderer(html); break;
        case 'text': renderer = new HTMLRenderer(html); break;
        default: renderer = new CanvasRenderer(canvas);
    }
}

//  ====
//  DRAW
//  ====

function draw() {
    if (video.element.paused) { return }
    videoCanvas.render(video.element)
    renderer.render(videoCanvas.getPixelData())
    requestAnimationFrame(draw)
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
toggleCameraBtn.addEventListener('click', () => video.toggleFacingMode)

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

//  SCREENSHOT BUTTON
//  -----------------

const download = /** @type HTMLAnchorElement */ (document.getElementById(CONSTANTS.OFFSCREEN_ANCHOR))

const screenshotButton = /** @type HTMLButtonElement */ (document.getElementById(CONSTANTS.SCREENSHOT))
screenshotButton.addEventListener('click', () => {
    const snapshot = renderer.snapshot()
    if (renderer.type === 'canvas') {
        download.setAttribute('href', snapshot)
        download.setAttribute('download', 'screenshot.png')
        download.click()
    } else if (renderer.type === 'html' || renderer.type === 'text') {
        navigator.clipboard.writeText(snapshot)
    }
})

// CLEAR CANVAS BUTTON
// -------------------

const clearScreenButton = /** @type HTMLButtonElement */ (document.getElementById(CONSTANTS.CLEAR_SCREEN))

clearScreenButton.addEventListener('click', () => renderer.clean())

//  TOGGLE THEME BUTTON
//  -------------------

const toggleThemeButton = /** @type HTMLButtonElement */ (document.getElementById(CONSTANTS.TOGGLE_THEME))

/** Select the appropriate emoji based on the current theme */
const getToggleThemeText = () => document.body.classList.contains(CONSTANTS.DARK_MODE) ? '🌞' : '🌙'

//  Initialize toggleThemeButton innerText
toggleThemeButton.innerText = getToggleThemeText()

//  Toggle the DARK_MODE class on the body and update the toggleThemeButton's innerText
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle(CONSTANTS.DARK_MODE)
    toggleThemeButton.innerText = getToggleThemeText()
})
