var loginBtn = document.getElementById('loginBtn')
var forLogDiv = document.getElementById('forLog')

function openMain() {
    window.location.replace('main.html')
}

function sendNotification(type = 'error', message, cb) {
    var loginNotification = document.createElement('claimer-login-log')
    loginNotification.setAttribute(type, message)
    forLogDiv.appendChild(loginNotification)

    loginNotification.addEventListener('finished', (event) => {
        forLogDiv.removeChild(loginNotification)

        if (typeof cb == 'function') cb()
    })
}

loginBtn.addEventListener('click', async () => {
    var usernameInpt = document.getElementById('username')
    var passwordInpt = document.getElementById('password')

    var username = usernameInpt.value, password = passwordInpt.value

    if (!username && !password) return sendNotification('error', 'Username and password are missing.')
    if (!username) return sendNotification('error', 'Username is missing.')
    if (!password) return sendNotification('error', 'Password is missing.')

    var err = await window.requests.login(username, password)

    if (err) return sendNotification('error', err)
    sendNotification('success', 'Logging in...', openMain)
})

window.requests.resumeSession()
    .then((err) => {
        if (err) return
        openMain()
    })