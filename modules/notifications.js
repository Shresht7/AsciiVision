//  Library
import { NOTIFICATIONS } from "./constants.js"

// =============
// NOTIFICATIONS
// =============

const notifications = /** @type HTMLDivElement */ (document.getElementById(NOTIFICATIONS))

/** Time after which the notification should fade-out */
const notificationsTimeout = 2000

/**
 * Shows a new notification
 * @param {string} text Text to display as a notification
 */
export function showNotification(text) {
    const toast = document.createElement('div')
    toast.classList.add("notification", "fade-in")
    toast.innerText = text

    notifications.appendChild(toast)

    //  Set Timeout to remove the element after notificationTimeout
    setTimeout(() => {
        //  Play fade-out animation
        toast.classList.add('fade-out')
        //  Remove the element from the DOM after 500ms
        setTimeout(() => notifications.removeChild(toast), 500)
    }, notificationsTimeout)
}
