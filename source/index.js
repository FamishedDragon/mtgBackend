const helmet = require('helmet')
const morgan = require('morgan')
const config = require('config')
const mongoose = require('mongoose')
const startupDebugger = require('debug')('router:startup')
const dbDebugger = require('debug')('router:db')
const express = require('express')
const logger = require('./middleware/logger')
const cards = require('./routes/cards')
const sets = require('./routes/sets')
import {getCards, testFunc} from "./actions/cardActions";

const app = express()

mongoose.connect('mongodb://localhost/mtgdb')
    .then(() => console.log('Connected to Mongo DB...'))
    .catch(error => console.log('Could not connect to DB', error))

// Host static content (takes name of folder with static content to publish on site)
app.use(express.static('public'))
// Security middleware
app.use(helmet())
// parse JSON in middleware
app.use(express.json())
app.use(logger)
// Any route that uses '/api/cards`, look to the given exported router
app.use('/api/cards', cards)
app.use('/api/sets', sets)

//Config
// console.log("Env Name: ", config.get('name'))
// console.log("Mail Server: ", config.get('mail.host'))
// console.log("Mail Password: ", config.get('mail.password')) // looks to env variables

// If running on dev machine, enable request logging middleware
if (app.get('env') === 'development') {
    // note: if 'NODE_ENV' variable is not set, will default to 'development'
    startupDebugger('Enabling Morgan request logger on development environment')
    app.use(morgan('tiny'))
}

// Database work...
dbDebugger('Database console log') //Set env variable DBUG=router:dbDebugger to turn on

app.get('/', (req, res) => {
    res.send('Hello World')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

console.log(testFunc)

testFunc()

async function load() {
    await getCards()
}

load()

module.exports.app = app
