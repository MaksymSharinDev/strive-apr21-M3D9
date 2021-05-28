const fetch = require("node-fetch");
let realToken = '';
let decoyToken = 'Acc̲̥̖̲̹̀͛͛̚̚es̺̉s̀͟_T͍͖̀͞o͈̘̦̽͌̃k̰͠e̢͗͆͟n̢̨̼̺̫̉̓̆͂̄_̤̬͚̇̄͘?̠̏_̟̌D̪͡R̮̲̖̺͙͛̋̄̃̕EA̝̦̤̹͊͑͆͘M̦͘_̪̲͒̆Í̡͎͚͙̟̍̈́̒͡T͗ͅ_XD'


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
                .then(data => {
                    realToken = data.access_token;
                    data.access_token = decoyToken
                    res.send(JSON.stringify(data))
                })
        } catch (e) {
            res.send(e)
        }
    })
    app.post('/api/product', async (req, res) => {
        try {
            if( ! req.body.access_token === decoyToken ) res.send( 'you need to use my token U.U \n' + decoyToken)
            await fetch('https://striveschool-api.herokuapp.com/api/product/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${realToken}`,
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
        if( ! req.body.access_token === decoyToken ) res.send( 'you need to use my token U.U \n' + decoyToken)
        try {
            await fetch(`https://striveschool-api.herokuapp.com/api/product`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${realToken}`,
                },
            })
                .then(response => response.json())
                .then(data => res.send(data))

        } catch (e) {
            res.send(e)
        }
    })

    let imgbbUploader = require("imgbb-uploader");

    app.post('/api/imageUpload', async (req, res) => {
        if( ! req.body.access_token === decoyToken ) res.send( 'you need to use my token U.U \n' + decoyToken)
            try {
                imgbbUploader({
                    apiKey: process.env.IMGBB_TOKEN,
                    base64string: req.body['blob'].split(',')[1]
                })
                    .then((response) => res.send(response))
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
    app.delete('/api/product/:id', async (req, res) => {
        if( ! req.body.access_token === decoyToken ) res.send( 'you need to use my token U.U \n' + decoyToken)
        try {
            if (req.params.id === '60b04910dc14580015e4ad61') {
                res.send('Nice try dude <3 the is the first think of everyone ')
            } else {
                await fetch(`https://striveschool-api.herokuapp.com/api/product/${req.params.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${realToken}`,
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        res.send(data)
                    })
            }

        } catch (e) {
            res.send(e)
        }
    })
};


