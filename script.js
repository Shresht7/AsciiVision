//@ts-check

//  =======
//  LIBRARY
//  =======

import * as CONSTANTS from "./modules/constants.js"
import { source, video } from './modules/Source/index.js'
import { renderer, selectRenderer } from "./modules/Renderer/index.js"
import { showNotification } from "./modules/utilities/index.js"

//  ====
//  DRAW
//  ====

function draw() {
    source.render()
    renderer.render(source.getPixelData())
    requestAnimationFrame(draw)
}

// ========
// CONTROLS
// ========

// CONTROL PANEL
// -------------

const controlPanel = /** @type HTMLDivElement */ (document.getElementById(CONSTANTS.CONTROL_PANEL))
const toggleControlPanel = /** @type HTMLButtonElement */ (document.getElementById(CONSTANTS.TOGGLE_CONTROL_PANEL))

// Show/Hide the control panel when toggled using the button
toggleControlPanel.addEventListener('click', () => {
    controlPanel.classList.toggle('hide')
})

//  RENDERER SELECT
//  ---------------

const rendererSelection = /** @type HTMLSelectElement */ (document.getElementById(CONSTANTS.CTRL_RENDERER_SELECT))

rendererSelection.addEventListener('input', (e) => {
    const target = /** @type HTMLSelectElement */ (e.target)
    const value = /** @type { 'canvas' | 'html' | 'text' } */ (target.value)
    selectRenderer(value)
    showNotification(`📹 Switched to ${value} renderer!`)
})

//  COLOR MODE CHECKBOX
//  -------------------

const colorModeCheckbox = /** @type HTMLInputElement */ (document.getElementById(CONSTANTS.COLOR_MODE_CHECKBOX))

colorModeCheckbox.addEventListener('change', (e) => {
    const target = /** @type HTMLInputElement */ (e.target)
    renderer.updateOptions({ colorMode: target.checked })
    showNotification(`${target.checked ? 'Enabled' : 'Disabled'} colors`)
})

//  CHARACTER SET INPUT
//  -------------------

const characterSetInput = /** @type HTMLInputElement */ (document.getElementById(CONSTANTS.CHARACTER_SET_INPUT))

characterSetInput.placeholder = CONSTANTS.DEFAULT_CHARSET
characterSetInput.addEventListener('input', (e) => {
    const target = /** @type HTMLInputElement */ (e.target)
    renderer.updateCharset(target.value || target.placeholder)
})

// SENSITIVITY SLIDER
// ------------------

const slider = /** @type HTMLInputElement */ (document.getElementById(CONSTANTS.CTRL_SENSITIVITY_SLIDER))

/**
 * Determines the current percentage
 * @param {number} value Current value
 * @param {number} max Maximum value
 * @param {number} min Minimum value
 */
const calculatePercentage = (value, max = 100, min = 0) => Math.round(((value / (max - min)) * 100)) + '%'

slider.addEventListener('input', (e) => {
    const target = /** @type HTMLInputElement  */ (e.target)
    const count = parseInt(target.value) + 1
    renderer.updateCharset((charset) => charset.trimEnd() + ' '.repeat(count))
})

slider.addEventListener('change', (e) => {
    const target = /** @type HTMLInputElement */ (e.target)
    const percentage = calculatePercentage(parseInt(target.value), parseInt(target.max), parseInt(target.min))
    showNotification(`🔦 Sensitivity changed to ${percentage}`)
})

// TOGGLE CAMERA BUTTON
// --------------------

const toggleCameraBtn = /** @type HTMLButtonElement */(document.getElementById(CONSTANTS.CTRL_TOGGLE_CAMERA))
toggleCameraBtn.addEventListener('click', () => {
    const previousMode = video.facingMode
    video.toggleFacingMode()
    if (video.facingMode !== previousMode) {
        showNotification('📷 Switched camera!')
    }
})

// START CAPTURE BUTTON
// --------------------

const startBtn = /** @type HTMLButtonElement */(document.getElementById(CONSTANTS.CTRL_START))
startBtn.addEventListener('click', async () => {
    source.element.classList.remove('hide')
    renderer.setup()
    await video.captureStream()
    draw()
    showNotification('▶️ Playback started!')
})

// STOP CAPTURE BUTTON
// -------------------

// const stopBtn = /** @type HTMLButtonElement */(document.getElementById(CONSTANTS.CTRL_STOP))
// stopBtn.addEventListener('click', () => {
//     video.stop()
//     renderer.clean()
//     source.element.classList.add('hide')
//     showNotification('🛑 Playback stopped!')
// })

//  SCREENSHOT BUTTON
//  -----------------

const download = /** @type HTMLAnchorElement */ (document.getElementById(CONSTANTS.OFFSCREEN_ANCHOR))

/** Time in milliseconds to disable the screenshot button as an attempt to prevent the user from spamming it. */
const timeoutDuration = 500

const screenshotButton = /** @type HTMLButtonElement */ (document.getElementById(CONSTANTS.SCREENSHOT))
screenshotButton.addEventListener('click', () => {
    //  Get the snapshot from the renderer
    const snapshot = renderer.snapshot()

    if (renderer.type === 'canvas') {
        //  If using the canvas-based renderer, download the screenshot
        download.setAttribute('href', snapshot)
        download.setAttribute('download', 'screenshot.png')
        download.click()
        showNotification('📸 Screenshot Captured!')
    } else if (renderer.type === 'html' || renderer.type === 'text') {
        //  If using a text-based renderer, copy the snapshot to clipboard
        navigator.clipboard.writeText(snapshot)
        showNotification('📋 Copied to Clipboard!')
    }

    //  Disable the screenshot button for timeoutDuration to prevent spam
    screenshotButton.setAttribute('disabled', 'true')
    setTimeout(() => { screenshotButton.removeAttribute('disabled') }, timeoutDuration)
})
