import { WIDTH, HEIGHT } from './constants.js'

// =====
// VIDEO
// =====

export class Video {

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
                width: WIDTH,
                height: HEIGHT,
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
