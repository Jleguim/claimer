var loginBtn = document.getElementById('loginBtn')
var forLogDiv = document.getElementById('forLog')

window.requests.resumeSession()
    .then(() => window.location.replace('main.html'))
    .catch(() => console.log('No session found'))

loginBtn.onclick = async () => {
    var usernameInpt = document.getElementById('username')
    var passwordInpt = document.getElementById('password')

    var username = usernameInpt.value, password = passwordInpt.value

    if (!username && !password) return errorHandler(0)
    if (!username) return errorHandler(1)
    if (!password) return errorHandler(2)

    var loginResponse = await window.requests.login(username, password)
    if (loginResponse.status != 200) return errorHandler(loginResponse.status)

    loginHandler()
}

function loginHandler() {
    var message = 'Logging in...'

    var loginLog = document.createElement('claimer-login-log')
    loginLog.setAttribute('success', message)
    forLogDiv.appendChild(loginLog)

    loginLog.addEventListener('finished', (event) => {
        forLogDiv.removeChild(loginLog)

        window.location.replace('main.html')
    })
}

function errorHandler(status) {
    var message = 'Unknown error'

    if (status == 403) message = 'Invalid credentials'
    else if (status == 0) message = 'Invalid username or password'
    else if (status == 1) message = 'Invalid username'
    else if (status == 2) message = 'Invalid password'

    var loginError = document.createElement('claimer-login-log')
    loginError.setAttribute('error', message)
    forLogDiv.appendChild(loginError)

    loginError.addEventListener('finished', (event) => {
        forLogDiv.removeChild(loginError)
    })
}