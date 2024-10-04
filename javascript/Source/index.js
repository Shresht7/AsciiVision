//@ts-check

//  Library
import { Source } from "./Source.js"
import { Video } from "./Video.js"

const SOURCE_VIDEO = 'source-video'
const SOURCE_CANVAS = 'source-canvas'

export const video = new Video(SOURCE_VIDEO)
export const source = new Source(SOURCE_CANVAS)

source.element = video.element
