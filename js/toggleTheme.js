/** @type HTMLButtonElement */
const toggleThemeButton = document.getElementById('toggle-theme')

toggleThemeButton.innerText = document.body.classList.contains('dark-mode') ? '🌞' : '🌙'

toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode')
    toggleThemeButton.innerText = document.body.classList.contains('dark-mode') ? '🌞' : '🌙'
})
