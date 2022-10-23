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
        this.element = document.getElementById(id)
        this.ctx = this.element.getContext('2d')
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
        const imageData = this.ctx.getImageData(0, 0, this.element.width, this.element.height)
        const data = imageData.data

        const res = []
        for (let i = 0; i < data.length; i += 4) {
            if (!res[row]) { res[row] = new Array(this.element.width) }
            const r = data[i + 0]
            const g = data[i + 1]
            const b = data[i + 2]
            const a = data[i + 3]
            res[row][column] = [r, g, b, a]
            if (column < this.element.width) {
                column++
            }
            if (column === this.element.width) {
                column = 0
                row++
            }
        }
        return res
    }

}
