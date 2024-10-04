//@ts-check

//  =========
//  CONSTANTS
//  =========

// TODO: #22 Adjustable Width and Height Settings
/** Desired width of the ASCII output */
export const WIDTH = 120
/** Desired height of the ASCII output */
export const HEIGHT = 90

/** Video element to capture user media from */
export const VIDEO = 'video'
/** Canvas associated with the user-media video element used to obtain pixel data */
export const SOURCE_CANVAS = 'source-canvas'

/** Control Panel ID */
export const CONTROL_PANEL = 'control-panel'
/** Control panel button to toggle between cameras */
export const CTRL_TOGGLE_CAMERA = 'toggle-camera'
/** Control panel button to start the video capture */
export const CTRL_START = 'start'
/** Control panel button to stop the video capture */
export const CTRL_STOP = 'stop'
/** Control panel slider that controls the brightness threshold value */
export const CTRL_SENSITIVITY_SLIDER = 'sensitivity-slider'
/** Control panel select that selects the renderer mode */
export const CTRL_RENDERER_SELECT = 'renderer-select'


export const COLOR_MODE_CHECKBOX = 'color-mode'

/** Characters to use to draw pixels */
export const DEFAULT_CHARSET = "█▓▒Ñ@#W$9876543210?!abc;:+=-,._ "
// const DEFAULT_CHARSET = '       .:-i|=+%O#@'
// const DEFAULT_CHARSET = '        .:░▒▓█';

/** Character Set Input */
export const CHARACTER_SET_INPUT = 'character-set-input'

/** Output ASCII Video Element */
export const ASCII_VIDEO = 'ascii-video'
export const ASCII_CANVAS = 'ascii-canvas'
export const ASCII_VIDEO_CONTAINER = 'ascii-video-container'

/** Screenshot Button */
export const SCREENSHOT = 'screenshot'
/** Clear Screen Button */
export const CLEAR_SCREEN = 'clear-screen'
/** Toggle Control Panel Button */
export const TOGGLE_CONTROL_PANEL = 'toggle-control-panel'
/** Toggle Theme Button */
export const TOGGLE_THEME = 'toggle-theme'
/** Dark-Mode class name */
export const DARK_MODE = 'dark-mode'

/** Offscreen Element */
export const OFFSCREEN = 'offscreen'
/** Offscreen Download Anchor */
export const OFFSCREEN_ANCHOR = 'offscreen-anchor'

/** CSS Class to hide elements */
export const CSS_HIDDEN = 'hide'
