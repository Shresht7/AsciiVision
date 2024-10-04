//@ts-check

//  Library
import { showNotification } from "./notifications.js"

const TOGGLE_THEME_ID = 'toggle-theme'
const DARK_MODE_CLASS = 'dark-mode'

// -------
// HELPERS
// -------

/** Returns the current theme */
const getTheme = () => document.body.classList.contains(DARK_MODE_CLASS) ? 'dark' : 'light'

/** Returns the current theme emoji */
const getThemeEmoji = () => document.body.classList.contains(DARK_MODE_CLASS) ? '🌙' : '🌞'

/** Select the appropriate emoji based on the current theme */
const getOppositeThemeEmoji = () => document.body.classList.contains(DARK_MODE_CLASS) ? '🌞' : '🌙'

//  ============
//  TOGGLE THEME
//  ============

const toggleThemeButton = /** @type HTMLButtonElement */ (document.getElementById(TOGGLE_THEME_ID))

//  Initialize toggleThemeButton innerText
toggleThemeButton.innerText = getOppositeThemeEmoji()

//  Toggle the DARK_MODE class on the body and update the toggleThemeButton's innerText
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle(DARK_MODE_CLASS)
    toggleThemeButton.innerText = getOppositeThemeEmoji()

    const theme = getTheme()
    showNotification(`${getThemeEmoji()} Enabled ${theme}-mode`)
    localStorage.setItem('theme', theme)
})

// INITIALIZE THEME
// ----------------

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add(DARK_MODE_CLASS)
    } else {
        document.body.classList.remove(DARK_MODE_CLASS)
    }
    toggleThemeButton.innerText = getOppositeThemeEmoji()
})
