//  =========
//  CONSTANTS
//  =========

/** Desired width of the ASCII output */
export const WIDTH = 120
/** Desired height of the ASCII output */
export const HEIGHT = 90

/** Map of Element IDs */
export const ID = {
    /** Video element to capture user media from */
    VIDEO: 'video',
    /** Canvas associated with the user-media video element used to obtain pixel data */
    VIDEO_CANVAS: 'video-canvas',

    /** Control panel button to toggle between cameras */
    CTRL_TOGGLE_CAMERA: 'toggle-camera',
    /** Control panel button to start the video capture */
    CTRL_START: 'start',
    /** Control panel button to stop the video capture */
    CTRL_STOP: 'stop',
    /** Control panel slider that controls the brightness threshold value */
    CTRL_SENSITIVITY_SLIDER: 'sensitivity-slider',

    /** Output ASCII Video Element */
    ASCII_VIDEO: 'ascii-video',

    /** Toggle Theme Button */
    TOGGLE_THEME: 'toggle-theme',
}
