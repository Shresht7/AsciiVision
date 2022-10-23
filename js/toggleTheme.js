import { TOGGLE_THEME, DARK_MODE } from './constants.js'

//  ============
//  TOGGLE THEME
//  ============

/** @type HTMLButtonElement */
const toggleThemeButton = document.getElementById(TOGGLE_THEME)

/** Select the appropriate emoji based on the current theme */
const getToggleThemeText = () => document.body.classList.contains(DARK_MODE) ? '🌞' : '🌙'

//  Initialize toggleThemeButton innerText
toggleThemeButton.innerText = getToggleThemeText()

//  Toggle the DARK_MODE class on the body and update the toggleThemeButton's innerText
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle(DARK_MODE)
    toggleThemeButton.innerText = getToggleThemeText()
})
