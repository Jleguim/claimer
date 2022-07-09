class ProductElement extends HTMLElement {
    constructor() {
        super()

        this.template = document.getElementById('product')
        this.product = document.importNode(this.template.content, true)
    }

    connectedCallback() {
        var buyButton = this.product.getElementById('buybtn')
        var productId = this.getAttribute('productId')

        buyButton.onclick = () => {
            console.log('Bought shit')
        }

        this.appendChild(this.product)
    }

    attributeChangedCallback(attr, oldval, newval) {
        switch (attr) {
            case 'name':
                var productname = this.product.getElementById('productname')
                productname.innerText = newval
                break
            case 'price':
                var productprice = this.product.getElementById('productprice')
                productprice.innerText = `${newval} Points`
                break
            case 'img':
                var productimg = this.product.getElementById('productimg')
                var productname = this.product.getElementById('productname')
                productimg.setAttribute('src', newval)
                productimg.setAttribute('alt', `${productname.innerText} Image`)
                break
        }
    }

    static get observedAttributes() {
        return ['name', 'price', 'img']
    }
}

window.customElements.define('claimer-product', ProductElement)