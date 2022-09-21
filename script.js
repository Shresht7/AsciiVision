/** @type HTMLVideoElement */
const video = document.getElementById('video')

/** @type HTMLButtonElement */
const startBtn = document.getElementById('start')
/** @type HTMLButtonElement */
const stopBtn = document.getElementById('stop')

/**
 * Capture the video stream using the navigator's mediaDevices api
 * @param {HTMLVideoElement} video Video element to play the stream
 * @param {boolean} start Start the video stream
 */
async function captureVideoStream(video, start = true) {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    })
    video.srcObject = stream
    if (start) { video.play() }
}

startBtn.addEventListener('click', () => {
    captureVideoStream(video)
})

stopBtn.addEventListener('click', () => {
    video.pause()
})
