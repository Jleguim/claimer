var contentDiv = document.getElementById('content')

async function openLogin() {
    await window.other.logout()
    window.location.replace('login.html')
}

async function renderProfilePage() {
    var { err, data } = await window.requests.me()

    if (err) return openLogin()

    var userSettings = document.createElement('claimer-user-settings')
    userSettings.setAttribute('username', data.username)

    contentDiv.innerHTML = ''
    contentDiv.appendChild(userSettings)
}

async function renderProductPage() {
    var { err, data } = await window.requests.getProducts()

    if (err) return openLogin()

    var grid = document.createElement('div')
    grid.classList.add('grid', 'grid-cols-1', 'grid-rows-1', 'gap-4', 'lg:grid-cols-5', 'sm:grid-cols-3', 'md:grid-cols-4', 'm-7')

    data.forEach((product, index) => {
        var productElement = document.createElement('claimer-product')
        productElement.setAttribute('productId', product._id)
        productElement.setAttribute('name', product.name)
        productElement.setAttribute('price', product.price)
        productElement.setAttribute('img', product.pictureUrl)
        grid.appendChild(productElement)

        if (data.length == index + 1) {
            contentDiv.innerHTML = ''
            contentDiv.appendChild(grid)
        }
    })
}

document.addEventListener('changedPage', (ev) => {
    var targetPage = ev.detail
    console.log(targetPage)

    switch (targetPage) {
        case 0:
            renderProductPage()
            break
        case 1:
            renderProfilePage()
            break
        case 2:
            openLogin()
            break
    }
})

sendEvent(0) // See navbar.js:20