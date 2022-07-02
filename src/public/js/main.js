var jwt = null

async function run() {
    try {
        var loginResponse = await window.requests.login('test', '1234')
        document.body.innerHTML += loginResponse.text
        jwt = loginResponse.jwt
        console.log(loginResponse)

        var getProductsResponse = await window.requests.getProducts(jwt)
        document.body.innerHTML += getProductsResponse.text
        jwt = getProductsResponse.jwt
        console.log(getProductsResponse)
    } catch (error) {
        console.log(error)
    }
}

run()