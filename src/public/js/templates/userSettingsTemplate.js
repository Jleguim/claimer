class UserSettingsElement extends HTMLElement {
    constructor() {
        super()

        this.template = document.getElementById('userSettings')
        this.userSettings = document.importNode(this.template.content, true)
    }

    connectedCallback() {
        const saveBtn = this.userSettings.getElementById('saveBtn')
        const usernameInpt = this.userSettings.getElementById('username')
        const newPassInpt = this.userSettings.getElementById('newPass')
        const confirmPassInpt = this.userSettings.getElementById('confirmPass')

        saveBtn.onclick = async () => {
            var toUpdate = {}
            var currentUsername = this.getAttribute('username')

            if (usernameInpt.value == ' ') return alert('Invalid username')
            if (newPassInpt.value == ' ') return alert('Invalid password')

            if (usernameInpt.value != currentUsername) {
                if (usernameInpt.value != '') {
                    toUpdate.username = usernameInpt.value
                }
            }

            if (newPassInpt.value == confirmPassInpt.value) {
                if (newPassInpt.value != '') {
                    toUpdate.password = newPassInpt.value
                }
            } else return alert('Passwords do not match.')

            console.log(toUpdate)
            await window.requests.updateUser(toUpdate)
            window.location.reload()
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