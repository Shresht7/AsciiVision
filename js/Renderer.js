//@ts-check

//  ========
//  RENDERER
//  ========

const DEFAULT_CHARSET = "█▓▒Ñ@#W$9876543210?!abc;:+=-,._ "
// const DEFAULT_CHARSET = '       .:-i|=+%O#@'
// const DEFAULT_CHARSET = '        .:░▒▓█';

export class Renderer {

    constructor(CHARSET = DEFAULT_CHARSET) {
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
        let character = this.CHARSET[value]
        if (character === ' ') { return "&nbsp;" } else { return character }
    }

    /** @typedef {[number, number, number, number]} PixelDataTuple */

    /**
     * Renders ASCII image based on the given pixel data array
     * @param {HTMLElement} node HTMLElement to render the ASCII text to
     * @param {PixelDataTuple[][]} data Pixel Data 2D Array
     */
    renderHTML(node, data) {
        let html = '<div>'
        for (const row of data) {
            for (const entry of row) {
                const [r, g, b, a] = entry
                const average = (r + g + b) / 3
                html += this.getChar(average)
            }
            html += '<br />'
        }
        html += '</div>'
        node.innerHTML = html
    }

}
