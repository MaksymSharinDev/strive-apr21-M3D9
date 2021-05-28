const express = require('express')
require('dotenv').config()
//const MongoClient = require('mongodb').MongoClient
//const bodyParser = require('body-parser')

const app = express()
const port = 8000
app.listen(port, () => console.log('We are live on ' + port) )
app.use(express.static('public'));
app.use(express.json({ limit: '2MB' }))
require('./app/routes')(app, {})
