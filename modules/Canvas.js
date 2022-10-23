//@ts-check

//  Library
import { WIDTH, HEIGHT } from "./constants.js"

//  ======
//  CANVAS
//  ======

export class Canvas {

    /** @type HTMLCanvasElement */
    element
    /** @type CanvasRenderingContext2D */
    ctx

    constructor(id) {
        this.element = /** @type HTMLCanvasElement */ (document.getElementById(id))
        this.ctx = /** @type CanvasRenderingContext2D */ (this.element.getContext('2d', { willReadFrequently: true }))
    }

    /**
     * Clears the canvas
     * @param {number} width Width to clear
     * @param {number} height Height to clear
     */
    clear(width = WIDTH, height = HEIGHT) {
        this.ctx.fillStyle = '#FFFFFF'
        this.ctx.fillRect(0, 0, width, height)
    }

    /**
     * Renders the image on the canvas
     * @param {CanvasImageSource} image Image Source
     * @param {number} width Width to render
     * @param {number} height Height to render
     */
    render(image, width = WIDTH, height = HEIGHT) {
        if (!width || !height) { return this.clear() }
        this.element.width = width
        this.element.height = height
        this.ctx.drawImage(image, 0, 0, width, height)
    }

    /**
     * Returns pixel data from the canvas
     * @returns Pixel Data Array
     */
    getPixelData() {
        //  Retrieve image data from the canvas context.
        const imageData = this.ctx.getImageData(0, 0, this.element.width, this.element.height)
        const data = imageData.data

        //  Variables to keep track of position in the 2D array
        let row = 0
        let column = 0

        /** Stores the resulting 2D pixel array */
        const result = []

        //  Iterate over the pixel array value-by-value
        for (let i = 0; i < data.length; i += 4) {
            //  Initialize a new row if needed
            if (!result[row]) { result[row] = new Array(this.element.width) }

            //  Capture RGBA values from pixel array
            const r = data[i + 0]
            const g = data[i + 1]
            const b = data[i + 2]
            const a = data[i + 3]
            result[row][column] = [r, g, b, a]

            //  Traverse the pixel array
            if (column < this.element.width) {      //  Increment columns till the element width...
                column++
            }
            if (column === this.element.width) {    // ...then reset column, and increment row.
                column = 0
                row++
            }
        }

        return result
    }

}
