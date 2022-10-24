//@ts-check

import { HEIGHT, WIDTH } from "./constants.js"

//  ========
//  RENDERER
//  ========

const DEFAULT_CHARSET = "█▓▒Ñ@#W$9876543210?!abc;:+=-,._ "
// const DEFAULT_CHARSET = '       .:-i|=+%O#@'
// const DEFAULT_CHARSET = '        .:░▒▓█';

export class Renderer {

    constructor({ text, canvas }, CHARSET = DEFAULT_CHARSET) {
        if (text) {
            this.element = /** @type HTMLElement */ (text)
        }
        if (canvas) {
            this.scale = 8
            this.canvas = /** @type HTMLCanvasElement */ (canvas)
            this.canvas.width = WIDTH * this.scale
            this.canvas.height = HEIGHT * this.scale
            this.ctx = /** @type CanvasRenderingContext2D */ (this.canvas.getContext('2d'))
        }
        this.CHARSET = CHARSET
    }

    /**
     * Update the character set
     * @param {(charset: string) => string} cb Callback function to transform the charset
     */
    updateCharset(cb) {
        this.CHARSET = cb(this.CHARSET)
    }

    /**
     * Get Character from the Character set that corresponds to the given value in the range
     * @param {number} val Value to map character to
     */
    getChar(val) {
        const value = Math.floor((val / 255) * (this.CHARSET.length - 1))
        return this.CHARSET[value]
    }

    /** @typedef {[number, number, number, number]} PixelDataTuple */

    /**
     * Renders ASCII image based on the given pixel data array
     * @param {PixelDataTuple[][]} data Pixel Data 2D Array
     */
    renderHTML(data) {
        if (!this.element) { throw new Error('Failed to initialize text element!') }
        let html = '<div>'
        for (const row of data) {
            for (const entry of row) {
                const [r, g, b, a] = entry
                const average = (r + g + b) / 3
                let character = this.getChar(average)
                character === ' ' ? "&nbsp;" : character
                html += this.getChar(average)
            }
            html += '<br />'
        }
        html += '</div>'
        this.element.innerHTML = html
    }

    /**
     * Renders ASCII image based on the given pixel data
     * @param {PixelDataTuple[][]} data Pixel Data 2D Array
     */
    renderCanvas(data) {
        if (!this.canvas || !this.ctx || !this.scale) { throw new Error('Failed to initialize canvas and context!') }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let row = 0; row < data.length; row++) {
            for (let column = 0; column < data[row].length; column++) {
                if (!data[row][column]) { continue }
                const [r, g, b, a] = data[row][column]
                const average = (r + g + b) / 3
                const character = this.getChar(average)
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
                this.ctx.fillText(character, column * this.scale, row * this.scale)
            }
        }
    }

}
