class UserSettingsElement extends HTMLElement {
    constructor() {
        super()

        this.template = document.getElementById('userSettings')
        this.userSettings = document.importNode(this.template.content, true)
    }

    connectedCallback() {
        const saveUsernameBtn = this.userSettings.getElementById('saveUsernameBtn')
        const usernameInpt = this.userSettings.getElementById('username')

        const savePassBtn = this.userSettings.getElementById('savePassBtn')
        const newPassInpt = this.userSettings.getElementById('newPass')
        const confirmPassInpt = this.userSettings.getElementById('confirmPass')

        saveUsernameBtn.onclick = async () => {
            var currentUsername = this.getAttribute('username')

            if (usernameInpt.value == ' ') return console.log('Invalid username')
            if (usernameInpt.value == currentUsername || usernameInpt.value == '') return

            window.requests.updateUsername(usernameInpt.value)
                .then((err) => {
                    if (err) return openLogin()
                    renderProfilePage()
                })
        }

        savePassBtn.onclick = async () => {
            if (newPassInpt.value == '' || confirmPassInpt.value == '') return console.log('Invalid password')
            if (newPassInpt.value != confirmPassInpt.value) return console.log('Passwords do not match')

            window.requests.updatePassword(newPassInpt.value)
                .then((err) => {
                    if (err) return openLogin()
                    renderProfilePage()
                })
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