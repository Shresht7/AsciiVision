//@ts-check

//  Library
import { Source } from "./Source.js"
import { Video } from "./Video.js"
import { VIDEO, SOURCE_CANVAS } from "../constants.js"

export const video = new Video(VIDEO)

export const source = new Source(SOURCE_CANVAS)

source.element = video.element
