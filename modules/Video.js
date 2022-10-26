//@ts-check

//  Library
import { WIDTH, HEIGHT } from './constants.js'

// =====
// VIDEO
// =====

/** Video element that plays the user media stream */
export class Video {

    /** @type HTMLVideoElement */
    element

    /** @type MediaStream | undefined */
    stream

    /** @type {'user' | 'environment'} */
    facingMode = 'user'

    /**
     * @param {string} id ID of the video element get user media stream from
     * @param {'user' | 'environment'} facingMode Camera facing mode 
     */
    constructor(id, facingMode = 'user') {
        this.element = /** @type HTMLVideoElement */ (document.getElementById(id))
        this.facingMode = facingMode
    }

    /** Toggle Camera Facing-Mode between 'user' and 'environment' */
    toggleFacingMode() {
        this.facingMode === 'user' ? 'environment' : 'user'
        if (!this.element.paused) { this.captureStream() }
    }

    /**
     * Capture the video stream using the navigator's mediaDevices api
     * @param {boolean} start Start the video stream automatically
     */
    async captureStream(start = true) {
        this.stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: WIDTH,
                height: HEIGHT,
                facingMode: this.facingMode,
            },
            audio: false
        })
        this.element.srcObject = this.stream
        if (start) { this.element.play() }
    }

    /** Play the video */
    play() {
        this.element.play()
    }

    /** Pause the video */
    pause() {
        this.element.pause()
    }

    /** Stop the video */
    stop() {
        this.stream?.getTracks().forEach(track => track.stop())
    }

}
