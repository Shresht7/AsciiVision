//@ts-check

//  Library
import { HEIGHT, WIDTH, DEFAULT_CHARSET } from "./constants.js"

//  Type Definitions
/** @typedef {[number, number, number, number]} PixelData */

//  ========
//  RENDERER
//  ========

export class Renderer {

    /**
     * @param {string} CHARSET Character-Set to use to draw pixels
     */
    constructor(CHARSET = DEFAULT_CHARSET) {
        this.CHARSET = CHARSET
        this.type = 'text'
    }

    /**
     * Update the character-set
     * @param {string | ((charset: string) => string)} cb Callback function to transform the charset
     */
    updateCharset(cb) {
        this.CHARSET = typeof cb === 'string' ? cb : cb(this.CHARSET)
    }

    /**
     * Get character from the character-set that corresponds to the given value in the range
     * @param {number} val Value to map character to
     */
    getChar(val) {
        const value = Math.floor((val / 255) * (this.CHARSET.length - 1))
        return this.CHARSET[value]
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
     * @param {string} CHARSET Character-Set to use to draw pixels
     */
    constructor(element, CHARSET = DEFAULT_CHARSET) {
        super(CHARSET)
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
     * @param {string} CHARSET Character-Set to use to draw pixels
     */
    constructor(element, CHARSET = DEFAULT_CHARSET) {
        super(CHARSET)
        this.element = /** @type HTMLCanvasElement */ (element)
        this.scale = 8
        this.ctx = /** @type CanvasRenderingContext2D */ (this.element.getContext('2d'))
        this.type = 'canvas'
    }

    /** Setup to perform when the renderer starts */
    setup() {
        this.element.width = WIDTH * this.scale
        this.element.height = HEIGHT * this.scale
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
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`     // TODO: #16 Add Option to toggle Color on and off
                this.ctx.fillText(character, column * this.scale, row * this.scale)

            }
        }
    }

    /**
     * @returns ASCII Image DataURL
     */
    snapshot() {
        return this.element.toDataURL()    // TODO: #23 Support Several Screenshot Formats
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
