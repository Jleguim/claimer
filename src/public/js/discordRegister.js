var registerLink = document.getElementById('discordRegister')
registerLink.onclick = () => window.discord.createDiscordAuthWindow()

window.discord.handleDiscordAuthFinished((event) => {
    window.requests.resumeSession()
        .then(() => window.location.replace('main.html'))
        .catch(() => console.log('No session found'))
})