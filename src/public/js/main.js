var contentDiv = document.getElementById('content')

function renderPage() {
    if (currentPage == 0) renderProductPage()
    if (currentPage == 1) renderProfilePage()
    // if (currentPage == 1) return contentDiv.innerHTML = ''
    // if (currentPage == 2) return contentDiv.innerHTML = ''
    // if (currentPage == 3) renderProfilePage()
}

async function renderProfilePage() {
    var getResponse = await window.requests.me()
    var myData = getResponse.body

    var userSettings = document.createElement('claimer-user-settings')
    userSettings.setAttribute('username', myData.username)

    contentDiv.innerHTML = ''
    contentDiv.appendChild(userSettings)
}

async function renderProductPage() {
    var getResponse = await window.requests.getProducts()
    var products = getResponse.body

    var grid = document.createElement('div')
    grid.classList.add('grid', 'grid-cols-1', 'grid-rows-1', 'gap-4', 'lg:grid-cols-5', 'sm:grid-cols-3', 'md:grid-cols-4')

    products.forEach((product, index) => {
        var productElement = document.createElement('claimer-product')
        productElement.setAttribute('productId', product._id)
        productElement.setAttribute('name', product.name)
        productElement.setAttribute('price', product.price)
        productElement.setAttribute('img', product.pictureUrl)
        grid.appendChild(productElement)

        if (products.length == index + 1) {
            contentDiv.innerHTML = ''
            contentDiv.appendChild(grid)
        }
    })
}

document.addEventListener('changedPage', renderPage)
renderPage()