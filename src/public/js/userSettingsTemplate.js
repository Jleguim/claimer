class UserSettingsElement extends HTMLElement {
    constructor() {
        super()

        this.template = document.getElementById('userSettings')
        this.userSettings = document.importNode(this.template.content, true)
    }

    connectedCallback() {
        const saveBtn = this.userSettings.getElementById('saveBtn')

        saveBtn.onclick = () => {
            console.log('saved shit')
        }

        this.appendChild(this.userSettings)
    }

    attributeChangedCallback(attr, oldval, newval) {
        switch (attr) {
            case 'username':
                var usernameInpt = this.userSettings.getElementById('username')
                usernameInpt.value = newval
                break
        }
    }

    static get observedAttributes() {
        return ['username']
    }
}

window.customElements.define('claimer-user-settings', UserSettingsElement)