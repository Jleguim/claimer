var navButtons = document.getElementById('nav-buttons')
var logoutBtn = document.getElementById('logoutBtn')
var logo = document.getElementById('logo')

var children = Array.from(navButtons.children)

function updateNavButtons(activeIndex) {
    children.forEach((child, index) => {
        if (index == activeIndex) {
            child.classList.remove('hover:bg-opacity-40')
            child.classList.add('bg-opacity-40')
            return
        }

        child.classList.remove('bg-opacity-40')
        child.classList.add('hover:bg-opacity-40')
    })
}

function sendEvent(activeIndex) {
    var event = new CustomEvent('changedPage', { detail: activeIndex })
    document.dispatchEvent(event)
}

function buttonOnClick(index) {
    updateNavButtons(index)
    sendEvent(index)
}

children.forEach((child, index) => {
    child.onclick = () => buttonOnClick(index)
})

logo.onclick = () => buttonOnClick(0)