var currentPage = 0;
var changedPageEvent = new Event('changedPage');

(function () {
    var navButtons = document.getElementById('nav-buttons')

    var logo = document.getElementById('logo')
    logo.onclick = changeCurrentAndUpdate(0)

    var children = Array.from(navButtons.children)
    children.forEach((child, index) => child.onclick = changeCurrentAndUpdate(index))

    var logoutBtn = document.getElementById('logoutBtn')
    logoutBtn.onclick = async () => {
        await window.other.logout()
        window.location.replace('login.html')
    }

    function changeCurrentAndUpdate(newCurrent) {
        return () => {
            currentPage = newCurrent
            updateNavButtons()

            document.dispatchEvent(changedPageEvent)
        }
    }

    function updateNavButtons() {
        children.forEach((child, index) => {
            if (index == currentPage) {
                child.classList.remove('hover:bg-opacity-40')
                child.classList.add('bg-opacity-40')
                return
            }

            child.classList.remove('bg-opacity-40')
            child.classList.add('hover:bg-opacity-40')
        })
    }
})()