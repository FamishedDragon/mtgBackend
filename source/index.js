//import * as express from 'express'
const helmet = require('helmet')
const morgan = require('morgan')
const config = require('config')
const mongoose = require('mongoose')
const startupDebugger = require('debug')('router:startup')
const dbDebugger = require('debug')('router:db')
const Joi = require('joi')
const express = require('express')
const logger = require('./middleware/logger')
const cards = require('./routes/cards')
const sets = require('./routes/sets')
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

const cardSchema = new mongoose.Schema({
    name: String,
    setID: Number,
    power: Number,
    toughness: Number,
    cardType: String,
    subType: String,
    tags: [ String ]
})

const Card = mongoose.model('Card', cardSchema)

async function createCard () {
    const card = new Card({
        name: 'Frozen Shade',
        setID: 1,
        power: 0,
        toughness: 1,
        cardType: 'Creature',
        subType: 'Shade',
        tags: [ 'Pump', 'MonoBlack' ]
    })

    const result = await card.save()
    console.log('Result', result)
}

async function getCards() {
    // Comparison Operators
    // gt, gte, lte, eq, ne, in, nin
    // Logical Operators
    // or, and
    // Regular Expressions
    // /^string/ == find anything that starts with string
    // /string$/ == find anything that ends with string
    // /.*string.*/ == find anything with string
    const allCards = await Card.find()

    console.log(allCards)
}

async function updateCard(id) {
    const card = Card.findByID(id)
    if (!card) {
        console.log(`No such ID: ${id}`)
        return
    }

    
}
getCards()

module.exports.app = app
