window.requests.get('/').then((res) => {
    document.body.innerHTML += res
})