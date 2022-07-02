window.requests.login('test', '1234')
    .then((res) => document.body.innerHTML += res)
    .catch((err) => console.log(err))