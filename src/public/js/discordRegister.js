var registerLink = document.getElementById('discordRegister')
registerLink.onclick = () => window.discord.createDiscordAuthWindow()

window.discord.handleDiscordAuthFinished((event) => {
    window.requests.resumeSession()
        .then((err) => {
            if (err) return
            openMain()
        })
})