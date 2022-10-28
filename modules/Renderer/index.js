//@ts-check

//  Library
import { Renderer, CanvasRenderer, HTMLRenderer } from "./Renderer.js"
import { ASCII_VIDEO, ASCII_CANVAS } from "../constants.js"

//  =====
//  ASCII
//  =====


const html = /** @type HTMLDivElement */ (document.getElementById(ASCII_VIDEO))
const canvas = /** @type HTMLCanvasElement */ (document.getElementById(ASCII_CANVAS))

/** @type {Renderer} */
export let renderer = new CanvasRenderer(canvas)

/**
 * Select the Renderer
 * @param {'canvas' | 'html' | 'text'} option Renderer Modes
 */
export function selectRenderer(option) {
    if (renderer.type === option) { return }
    renderer.clean()
    switch (option) {
        case 'canvas': renderer = new CanvasRenderer(canvas); break;
        case 'html': renderer = new HTMLRenderer(html); break;
        case 'text': renderer = new HTMLRenderer(html); break;
        default: renderer = new CanvasRenderer(canvas);
    }
}
