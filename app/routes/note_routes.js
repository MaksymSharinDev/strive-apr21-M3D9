const fetch = require("node-fetch");


module.exports = function (app, db) {


    app.post('/api/login', async (req, res) => {
        try {
            await fetch('https://striveschool-api.herokuapp.com/api/account/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "username": `${process.env.STRIVE_EMAIL}`,
                    "password": `${process.env.STRIVE_PASSWORD}`
                })
            }).then(response => response.json()).then(data => res.send(JSON.stringify(data)))
        } catch (e) {
            res.send(e)
        }
    })

    app.post('/api/product', async (req, res) => {

        try {
            await fetch('https://striveschool-api.herokuapp.com/api/product/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.body['access_token']}`,
                },
                body: JSON.stringify(req.body)
            })
            .then( response => response.json() )
            .then(data => res.send( data ) ) //res.send(data))

        } catch (e) {
            res.send(e)
        }
    })
    app.post('/api/product/all', async (req, res) => {

        try {
            await fetch(`https://striveschool-api.herokuapp.com/api/product`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.body['access_token']}`,
                },
            })
                .then( response => response.json() )
                .then(data => res.send( data ) )

        } catch (e) {
            res.send(e)
        }
    })

    /*
    app.get('/api/product', (req, res) => {
        let token = 'Bearer ' + req.body['access_token']
        try {
            fetch('https://striveschool-api.herokuapp.com/api/product/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            }).then(res => res.json()).then(data => { console.log(e) ; res.send(data) })
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    })
*/

};


