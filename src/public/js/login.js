var content = document.getElementById('content')
var loginForm = document.getElementById('loginForm')

var submit = document.getElementById('submit')
submit.onclick = async function () {
    var input_username = document.getElementById('username')
    var input_password = document.getElementById('password')

    var credentials = {
        username: input_username.value,
        password: input_password.value
    }

    if (!credentials.username && !credentials.password) return errorHandler(0)
    if (!credentials.username) return errorHandler(1)
    if (!credentials.password) return errorHandler(2)

    try {
        var loginResponse = await window.requests.login('test', '1234')
        document.body.innerHTML += loginResponse.text
        window.keys.jwt(loginResponse.jwt)

        window.location.replace('main.html')
    } catch (error) {
        console.log(error)
    }
}

function errorHandler(status) {
    var div_forError = document.getElementById('forError')
    var message

    if (status == 406 || status == 401) message = 'Invalid credentials'
    if (status == 0) message = 'Invalid username and password'
    if (status == 1) message = 'Invalid username'
    if (status == 2) message = 'Invalid password'

    createErrorDiv(message, div_forError)
}

function createErrorDiv(error_message, parent) {
    var error_alert = createElement('div', { role: 'alert' }, ['bg-red-100', 'border', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'relative', 'my-3', 'fast'])

    var span_message = createElement('span', { innerText: error_message }, ['block', 'sm:inline'])
    error_alert.appendChild(span_message)

    parent.appendChild(error_alert)

    setTimeout(() => {
        animateCSS(error_alert, 'fadeOut', () => {
            parent.removeChild(error_alert)
        })
    }, 2500)
}

function animateCSS(element, animationName, callback) {
    const node = element
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

function createElement(elementTag, parameters, classes, styles) {
    var element = document.createElement(elementTag)

    if (typeof parameters == 'object' && parameters != undefined) {
        for (const parameter in parameters) {
            element[parameter] = parameters[parameter]
        }
    }

    if (typeof classes == 'object' && classes != undefined) {
        classes.forEach(className => {
            element.classList.add(className)
        })
    }

    if (typeof styles == 'object' && styles != undefined) {
        for (const style in styles) {
            element.style[style] = styles[style]
        }
    }

    return element
}