class LogElement extends HTMLElement {
    constructor() {
        super()

        this.template = document.getElementById('login-log')
        this.log = document.importNode(this.template.content, true)
        this.finishedEvent = new Event('finished')
    }

    handleAnimationEnd() {
        this.classList.remove('animated', 'fadeOut')
        this.removeEventListener('animationend', this.handleAnimationEnd)

        this.dispatchEvent(this.finishedEvent)
    }

    connectedCallback() {
        this.appendChild(this.log)

        setTimeout(() => {
            this.classList.add('animated', 'fadeOut')
            this.addEventListener('animationend', this.handleAnimationEnd)
        }, 1500)
    }

    attributeChangedCallback(attr, oldval, newval) {
        switch (attr) {
            case 'error':
                var logMessage = this.log.getElementById('log')
                logMessage.innerText = newval
                this.log.firstElementChild.classList.add('border-red-400', 'bg-red-100', 'text-red-700')
                break
            case 'success':
                var logMessage = this.log.getElementById('log')
                logMessage.innerText = newval
                this.log.firstElementChild.classList.add('border-emerald-400', 'bg-emerald-100', 'text-emerald-700')
                break
        }
    }

    static get observedAttributes() {
        return ['error', 'success']
    }
}

window.customElements.define('claimer-login-log', LogElement)