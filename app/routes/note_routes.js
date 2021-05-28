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
            })
                .then(response => response.json())
                .then(data => res.send(JSON.stringify(data)))
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
                .then(response => response.json())
                .then(data => res.send(data)) //res.send(data))

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
                .then(response => response.json())
                .then(data => res.send(data))

        } catch (e) {
            res.send(e)
        }
    })
    /*
    const {createProxyMiddleware} = require('http-proxy-middleware')
    app.use('/api/imageUpload', createProxyMiddleware({
        target: `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_TOKEN}`,
        changeOrigin: true
    }), () =>{ console.log( )})*/
    let imgbbUploader = require("imgbb-uploader");

    app.post('/api/imageUpload', async (req, res) => {
            try {
                imgbbUploader({
                    apiKey: process.env.IMGBB_TOKEN,
                    base64string: req.body['blob'].split(',')[1]
                })
                    .then((response) => res.send( response) )
                    .catch((error) => error)
               /* return await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_TOKEN}`, {
                    method: 'POST',
                    body: req.body,
                })
                    .then(response => {
                        console.log(response);
                        response.json()
                    })
                    .then(data => {
                        console.log(data);
                        res.send(data)
                    }) */
            } catch (e) {
                console.log(e)
                res.send(e)
            }
        }
    )
    app.delete('/api/product/:id',async (req, res) =>{
        console.log(req.body)
        try {
            await fetch(`https://striveschool-api.herokuapp.com/api/product/${req.params.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.body['access_token']}`,
                },
            })
                .then(response => response.json())
                .then(data => { console.log(data); res.send(data)  })// res.send(data))

        } catch (e) {
            res.send(e)
        }
    })
};


