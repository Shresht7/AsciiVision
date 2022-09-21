//  =======
//  LIBRARY
//  =======

import "./js/toggleTheme.js"

//  =========
//  CONSTANTS
//  =========

const WIDTH = 120
const HEIGHT = 90

// =====
// VIDEO
// =====

/** @type HTMLVideoElement */
const video = document.getElementById('video')

/**
 * Capture the video stream using the navigator's mediaDevices api
 * @param {HTMLVideoElement} video Video element to play the stream
 * @param {boolean} start Start the video stream
 */
async function captureVideoStream(video, start = true) {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: WIDTH,
            height: HEIGHT,
        },
        audio: false,
    })
    video.srcObject = stream
    if (start) { video.play() }
    draw()
}

//  ======
//  CANVAS
//  ======

/** @type HTMLCanvasElement */
const videoCanvas = document.getElementById('video-canvas')
const videoCanvasCtx = videoCanvas.getContext('2d')

//  ========
//  CONTROLS
//  ========

/** @type HTMLButtonElement */
const startBtn = document.getElementById('start')
/** @type HTMLButtonElement */
const stopBtn = document.getElementById('stop')

startBtn.addEventListener('click', () => {
    captureVideoStream(video)
})

stopBtn.addEventListener('click', () => {
    video.pause()
})

//  =======
//  HELPERS
//  =======

/**
 * The Canvas context to clear
 * @param {CanvasRenderingContext2D} ctx Canvas context
 * @param {number} width height to clear
 * @param {number} height width to clear
 */
function clearCanvas(ctx, width = WIDTH, height = HEIGHT) {
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, width, height)
}

/**
 * Render the canvas
 * @param {HTMLCanvasElement} canvas Canvas
 * @param {CanvasRenderingContext2D} ctx Canvas context
 * @param {CanvasImageSource} image Image source
 * @param {number} ctx width
 * @param {number} ctx height
 */
function renderCanvas(canvas, ctx, image, width = WIDTH, height = HEIGHT) {
    if (!width || !height) { return clearCanvas(ctx) }
    canvas.width = width
    canvas.height = height
    ctx.drawImage(image, 0, 0, width, height)
}

/**
 * Get Pixel Array Data
 * @param {HTMLCanvasElement} canvas Canvas
 * @param {CanvasRenderingContext2D} ctx Canvas context
 */
function getPixelData(canvas, ctx) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    const res = []
    let row = 0, column = 0
    for (let i = 0; i < data.length; i += 4) {
        if (!res[row]) { res[row] = new Array(canvas.width) }
        const r = data[i + 0]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]
        res[row][column] = [r, g, b, a]
        if (column < canvas.width) {
            column++
        }
        if (column === canvas.width) {
            column = 0
            row += 1
        }

    }
    return res
}

//  =====
//  ASCII
//  =====

let CHARSET = "█▓▒Ñ@#W$9876543210?!abc;:+=-,._ ";
// const CHARSET = '       .:-i|=+%O#@'
// const CHARSET = '        .:░▒▓█';

const slider = document.getElementById('slider')

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

const textElement = document.getElementById('ascii-video')

//  ====
//  DRAW
//  ====

function draw() {
    if (video.paused) { return }
    renderCanvas(videoCanvas, videoCanvasCtx, video)
    const data = getPixelData(videoCanvas, videoCanvasCtx)
    renderText(textElement, data)
    requestAnimationFrame(draw)
}
