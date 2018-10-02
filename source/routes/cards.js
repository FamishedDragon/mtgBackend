const express = require('express')
const Joi = require('joi')
const mongoose = require('mongoose')
import {httpCode} from "../util/constants";

const router = express.Router()

var cards = [
    {id: 1, name: 'cardOne'},
    {id: 2, name: 'cardTwo'},
    {id: 3, name: 'cardThree'}
]
// const cardSchema = {
//     id: Joi.number(),
//     name: Joi.string().min(3).required()
// }

const cardSchema = new mongoose.Schema({
    name: String,
    setID: Number,
    power: Number,
    toughness: Number,
    cardType: String,
    subType: String,
    tags: [ String ]
})

//const Card = mongoose.model('Card', cardSchema)

// async function createCard () {
//     const card = new Card({
//         name: 'Lightning Bolt',
//         setID: 1,
//         power: null,
//         toughness: null,
//         cardType: 'Instant',
//         subType: null,
//         tags: [ 'Burn' ]
//     })
//
//     const result = await card.save()
//     console.log('Result', result)
// }

function validateCard(card) {
    return Joi.validate(card, cardSchema)
}

// GET all cards
router.get('/', (req, res) => {
    res.send(cards)
})

// POST add new card
router.post('/', (req, res) => {
    const { error } = validateCard(req.body)
    if (error) {
        return res.status(httpCode.error).send(error.details[0].message)
    }

    const newCard = {
        id: cards.length + 1,
        name: req.body.name
    }
    cards.push(newCard)
    res.send(newCard)
})

// Modify existing card
router.put('/:id', (req, res) => {
    const card = cards.find(c => c.id === parseInt(req.params.id))
    if (!card) {
        return res.status(httpCode.doesNotExist).send(`ERROR: Card with ID ${req.params.id} does not exist`)
    }
    const { error } = validateCard(req.body)
    if (error) {
        return res.status(httpCode.error).send(error.details[0].message)
    }

    card.name = req.body.name
    res.send(card)
})

// DELETE by ID
router.delete('/:id', (req, res) => {
    const card = cards.find(c => c.id === parseInt(req.params.id))
    if (!card) {
        return res.status(httpCode.doesNotExist).send(`ERROR: Card with ID ${req.params.id} does not exist`)
    }

    const index = cards.indexOf(card)

    cards.splice(index, 1)

    res.send(cards)
})

// GET card by ID
router.get('/:id', (req, res) => {
    const card = cards.find(c => c.id === parseInt(req.params.id))
    if (card) {
        res.send(card)
    }
    else {
        return res.status(httpCode.doesNotExist).send(`ERROR: Card with ID ${req.params.id} does not exist`)
    }
})

module.exports = router;