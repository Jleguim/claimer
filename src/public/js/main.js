var contentDiv = document.getElementById('content')

// stuff that should be in a db call 
var points = 1337
var products = [
    { name: 'Cool Rank', price: 123, picture: 'https://cdn.discordapp.com/attachments/451359497546498051/993374995638140958/logo.png' },
    { name: 'T-shirt', price: 321, picture: 'https://cdn.discordapp.com/attachments/451359497546498051/993374995638140958/logo.png' },
    { name: 'Red Jacket', price: 53, picture: 'https://cdn.discordapp.com/attachments/451359497546498051/993374995638140958/logo.png' },
    { name: 'Product', price: 12, picture: 'https://cdn.discordapp.com/attachments/451359497546498051/993374995638140958/logo.png' },
    { name: 'Dust', price: 1, picture: 'https://cdn.discordapp.com/attachments/451359497546498051/993374995638140958/logo.png' },
    { name: 'More Dust', price: 1, picture: 'https://cdn.discordapp.com/attachments/451359497546498051/993374995638140958/logo.png' }
]
// ------


function renderPage() {
    console.log(currentPage)
    if (currentPage == 0) renderProductClaimer()
}

function renderProductClaimer() {
    contentDiv.innerHTML = ''

    var grid = document.createElement('div')
    grid.classList.add('grid', 'grid-cols-1', 'grid-rows-1', 'gap-4', 'lg:grid-cols-5', 'sm:grid-cols-3', 'md:grid-cols-4')
    contentDiv.appendChild(grid)

    products.forEach((product, index) => {
        var productElement = document.createElement('claimer-product')
        productElement.setAttribute('name', product.name)
        productElement.setAttribute('price', product.price)
        productElement.setAttribute('img', product.picture)
        grid.appendChild(productElement)

        console.log(product)
    })
}

document.addEventListener('changedPage', renderPage)
renderPage()