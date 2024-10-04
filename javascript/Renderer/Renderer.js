//@ts-check

//  Library
import { HEIGHT, WIDTH, DEFAULT_CHARSET } from "../constants.js"

//  Type Definitions
/** @typedef {[number, number, number, number]} PixelData */
/** @typedef {{ CHARSET: string, scale: number, colorMode: boolean }} ConstructorOptions */

//  ========
//  RENDERER
//  ========

/**
 * Default Constructor Options
 * @type ConstructorOptions
 */
const defaultOptions = {
    CHARSET: DEFAULT_CHARSET,
    scale: 1,
    colorMode: false
}

export class Renderer {

    /**
     * @param {ConstructorOptions} opts Renderer Constructor Options
     */
    constructor(opts = defaultOptions) {
        this.options = opts
        this.type = 'text'
    }

    /**
     * Update Renderer Options
     * @param {Partial<ConstructorOptions>} newOpts New options to apply
     */
    updateOptions(newOpts) {
        this.options = { ...this.options, ...newOpts }
    }

    /**
     * Update the character-set
     * @param {string | ((charset: string) => string)} cb Callback function to transform the charset
     */
    updateCharset(cb) {
        const CHARSET = typeof cb === 'string' ? cb : cb(this.options.CHARSET)
        this.updateOptions({ CHARSET })
    }

    /**
     * Get character from the character-set that corresponds to the given value in the range
     * @param {number} val Value to map character to
     */
    getChar(val) {
        const value = Math.floor((val / 255) * (this.options.CHARSET.length - 1))
        return this.options.CHARSET[value]
    }

    /**
     * Returns the ASCII image based on the given pixel data array
     * @param {PixelData[][]} data Pixel Data 2D Array
     * @returns Rendered Text
     */
    transform(data) {
        let text = ''
        for (const row of data) {
            for (const entry of row) {
                const [r, g, b, a] = entry
                const average = (r + g + b) / 3
                text += this.getChar(average)
            }
            text += '\n'
        }
        return text
    }

    /** Setup to perform when starting the renderer */
    setup() { }

    /**
     * Renders the ASCII output
     * @param {PixelData[][]} data Pixel Data 2D Array
     */
    render(data) { }

    /** Returns a snapshot of the ASCII image */
    snapshot() { return '' }

    /** Cleanup to perform after the renderer stops */
    clean() { }
}

export class HTMLRenderer extends Renderer {

    /**
     * @param {HTMLElement} element HTMLElement to render the ASCII image to
     * @param {ConstructorOptions} opts Renderer Constructor Options
     */
    constructor(element, opts = defaultOptions) {
        super(opts)
        this.element = /** @type HTMLElement */ (element)
        this.type = 'html'
    }

    /**
     * Returns the ASCII image based on the given pixel data array
     * @param {PixelData[][]} data Pixel Data 2D Array
     * @returns Rendered HTML
     */
    transform(data) {
        let html = '<div>'
        for (const row of data) {
            for (const entry of row) {
                const [r, g, b, a] = entry
                const average = (r + g + b) / 3
                let character = this.getChar(average)
                character === ' ' ? '&nbsp;' : character
                html += character
            }
            html += '<br />'
        }
        html += '</div>'
        return html
    }

    /**
     * Renders the ASCII image to the HTMLElement based on the given pixel data array
     * @param {PixelData[][]} data Pixel Data 2D Array
     */
    render(data) {
        this.element.innerHTML = this.transform(data)
    }

    /**
     * @returns ASCII Image as text
     */
    snapshot() {
        return this.element.innerText
    }

    /** Cleanup the renderer */
    clean() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild)
        }
    }

}

export class CanvasRenderer extends Renderer {

    /**
     * @param {HTMLCanvasElement} element HTMLCanvasElement to draw the ASCII image to
     * @param {ConstructorOptions} opts Renderer Constructor Options
     */
    constructor(element, opts = defaultOptions) {
        super(opts)
        this.updateOptions({ scale: 8 })
        this.element = /** @type HTMLCanvasElement */ (element)
        this.ctx = /** @type CanvasRenderingContext2D */ (this.element.getContext('2d'))
        this.type = 'canvas'
    }

    /** Setup to perform when the renderer starts */
    setup() {
        const parentElement = /** @type HTMLElement */ (this.element.parentElement)
        const sourceCanvas = /** @type HTMLElement */ (document.getElementById('source-canvas'))
        this.element.width = sourceCanvas?.clientWidth || WIDTH * this.options.scale
        this.element.height = sourceCanvas?.clientHeight || HEIGHT * this.options.scale
        this.ctx.fillStyle = window.getComputedStyle(parentElement).getPropertyValue('--color-text')
    }

    /**
 * Renders ASCII image based on the given pixel data
 * @param {PixelData[][]} data Pixel Data 2D Array
 */
    render(data) {
        //  Clear the canvas
        this.ctx.clearRect(0, 0, this.element.width, this.element.height)

        //  Iterate over the pixel data array
        for (let row = 0; row < data.length; row++) {
            for (let column = 0; column < data[row].length; column++) {

                //  Skip undefined entries // ? Is this actually needed?
                if (!data[row][column]) { continue }

                //  Extract RGBA values from entry
                const [r, g, b, a] = data[row][column]

                //  Determine Character
                const average = (r + g + b) / 3
                const character = this.getChar(average)

                //  Render to Canvas
                if (this.options.colorMode) {
                    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
                }
                this.ctx.fillText(character, column * this.options.scale, row * this.options.scale)

            }
        }
    }

    /**
     * Takes a screenshot of the current element and returns it as a DataURL.
     * @param {string} [format='png'] - The format of the screenshot. Must be one of 'png', 'jpeg', or 'webp'.
     * @throws {Error} If the specified format is not supported.
     * @returns {string} The screenshot as a DataURL.
     */
    snapshot(format = 'png') {
        const supportedFormats = ['png', 'jpeg', 'webp']  // List of supported formats
        if (!supportedFormats.includes(format)) {
            throw new Error(`Unsupported format: ${format}`)
        }
        return this.element.toDataURL(`image/${format}`)
    }

    /** Cleanup to perform when the renderer stops */
    clean() {
        this.element.width = 0
        this.element.height = 0
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild)
        }
    }

}
