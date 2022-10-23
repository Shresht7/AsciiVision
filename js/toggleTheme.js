import { ID } from 'constants.js'

//  ============
//  TOGGLE THEME
//  ============

/** @type HTMLButtonElement */
const toggleThemeButton = document.getElementById(ID.TOGGLE_THEME)

toggleThemeButton.innerText = document.body.classList.contains('dark-mode') ? '🌞' : '🌙'

toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode')
    toggleThemeButton.innerText = document.body.classList.contains('dark-mode') ? '🌞' : '🌙'
})
