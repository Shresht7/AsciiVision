import { ID } from 'constants.js'

//  ============
//  TOGGLE THEME
//  ============

/** @type HTMLButtonElement */
const toggleThemeButton = document.getElementById(ID.TOGGLE_THEME)

/** Select the appropriate emoji based on the current theme */
const darkModeText = () => document.body.classList.contains(ID.DARK_MODE) ? '🌞' : '🌙'

//  Initialize toggleThemeButton innerText
toggleThemeButton.innerText = darkModeText()

//  Toggle the DARK_MODE class on the body and update the toggleThemeButton's innerText
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle(ID.DARK_MODE)
    toggleThemeButton.innerText = darkModeText()
})
