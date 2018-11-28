import {httpCode} from "../util/constants";
import {getCards, validateCard} from "../actions/cardActions";
import express from'express'
import mongoose from'mongoose'
const router = express.Router()

// region API
// base URI = /api/cards
// GET all cards
router.get('/', (req, res) => {
    getCards().then(response => res.send(response))
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
//endregion

export default router;