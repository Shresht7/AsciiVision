//  =========
//  CONSTANTS
//  =========

const WIDTH = 320
const HEIGHT = 180

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
            height: HEIGHT
        },
        audio: false,
    })
    video.srcObject = stream
    if (start) { video.play() }
    draw()
}

//  ============
//  VIDEO CANVAS
//  ============

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
    canvas.width = WIDTH
    canvas.height = HEIGHT
    ctx.drawImage(image, 0, 0, width, height)
}

//  ====
//  DRAW
//  ====

function draw() {
    if (video.paused) { return }
    renderCanvas(videoCanvas, videoCanvasCtx, video)
    requestAnimationFrame(draw)
}
