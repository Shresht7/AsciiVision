//  =======
//  LIBRARY
//  =======

import * as CONSTANTS from "./js/constants.js"
import "./js/toggleTheme.js"

// =====
// VIDEO
// =====

class Video {

    /** @type HTMLVideoElement */
    element
    facingMode = 'user'
    isPlaying = false;

    constructor(id, facingMode = 'user') {
        this.element = document.getElementById(id)
        this.facingMode = facingMode
    }

    /** Toggle Camera Facing-Mode between 'user' and 'environment' */
    toggleFacingMode() {
        this.facingMode === 'user' ? 'environment' : 'user'
        if (this.isPlaying) { this.captureStream() }
    }

    /**
     * Capture the video stream using the navigator's mediaDevices api
     * @param {boolean} start Start the video stream automatically
     */
    async captureStream(start = true) {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: CONSTANTS.WIDTH,
                height: CONSTANTS.HEIGHT,
                facingMode: this.facingMode,
            },
            audio: false
        })
        this.element.srcObject = stream
        if (start) { this.element.play() }
        draw()
    }

    play() {
        this.element.play()
    }

    pause() {
        this.element.pause()
    }

}

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

//  ======
//  CANVAS
//  ======

class Canvas {

    /** @type HTMLCanvasElement */
    element
    /** @type CanvasRenderingContext2D */
    ctx

    constructor(id) {
        this.element = document.getElementById(id)
        this.ctx = this.element.getContext('2d')
    }

    /**
     * Clears the canvas
     * @param {number} width Width to clear
     * @param {number} height Height to clear
     */
    clear(width = CONSTANTS.WIDTH, height = CONSTANTS.HEIGHT) {
        this.ctx.fillStyle = '#FFFFFF'
        this.ctx.fillRect(0, 0, width, height)
    }

    /**
     * Renders the image on the canvas
     * @param {CanvasImageSource} image Image Source
     * @param {number} width Width to render
     * @param {number} height Height to render
     */
    render(image, width = CONSTANTS.WIDTH, height = CONSTANTS.HEIGHT) {
        if (!width || !height) { return this.clear() }
        this.element.width = width
        this.element.height = height
        this.ctx.drawImage(image, 0, 0, width, height)
    }

    /**
     * Returns pixel data from the canvas
     * @returns Pixel Data Array
     */
    getPixelData() {
        const imageData = this.ctx.getImageData(0, 0, this.element.width, this.element.height)
        const data = imageData.data

        const res = []
        for (let i = 0; i < data.length; i += 4) {
            if (!res[row]) { res[row] = new Array(this.element.width) }
            const r = data[i + 0]
            const g = data[i + 1]
            const b = data[i + 2]
            const a = data[i + 3]
            res[row][column] = [r, g, b, a]
            if (column < this.element.width) {
                column++
            }
            if (column === this.element.width) {
                column = 0
                row++
            }
        }
        return res
    }

}

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
