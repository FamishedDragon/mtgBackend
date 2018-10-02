const express = require('express')
const router = express.Router()
const Joi = require('joi')

const setSchema = {
    id: Joi.number(),
    name: Joi.string().min(3).required(),
    symbol: Joi.string().min(3).required(),
    abbreviation: Joi.string().required(),
    releaseYear: Joi.number().min(4).required()
}

function validateSets (set) {
    return Joi.validate(set, setSchema)
}

var sets = [
    {id: 1, name: 'Alpha', symbol: 'alpha.png', abbreviation: 'A', releaseYear: 1993},
    {id: 2, name: 'Beta', symbol: 'beta.png', abbreviation: 'B', releaseYear: 1993},
    {id: 3, name: 'Unlimited', symbol: 'unlimited.png', abbreviation: 'U', releaseYear: 1993},
    {id: 4, name: 'Arabian Nights', symbol: 'arabian_nights.png', abbreviation: 'ARN', releaseYear: 1993},
    {id: 5, name: 'Antiquities', symbol: 'antiquities.png', abbreviation: 'ANT', releaseYear: 1993},
]

// GET all sets
router.get('/', (req, res) => {
    res.send(sets)
})

// POST new sets
router.post('/', (req, res) => {
    const {error} = validateSets(req.body)
    if (error) {
        res.status(400).send(error.details[0].message)
    }

    const newSet = {
        id: sets.length + 1,
        name: req.body.name,
        symbol: req.body.symbol,
        abbreviation: req.body.abbreviation,
        releaseYear: req.body.releaseYear
    }
    sets.push(newSet)
    res.send(sets)
})

// Modify existing card
router.put('/:id', (req, res) => {
    const card = cards.find(c => c.id === parseInt(req.params.id))
    if (!card) {
        return res.status(404).send(`ERROR: Card with ID ${req.params.id} does not exist`)
    }
    const { error } = validateCard(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    card.name = req.body.name
    res.send(card)
})

// DELETE by ID
router.delete('/:id', (req, res) => {
    const set = sets.find(s => s.id === parseInt(sets.params.id))
    if (!set) {
        return res.status(404).send(`ERROR: Set with ID ${sets.params.id} does not exist`)
    }

    const index = sets.indexOf(set)
    sets.splice(index, 1)
    res.send(sets)
})

// GET card by ID
router.get('/:id', (req, res) => {
    const set = sets.find(c => c.id === parseInt(req.params.id))
    if (set) {
        res.send(set)
    }
    else {
        return res.status(404).send(`ERROR: Card with ID ${req.params.id} does not exist`)
    }
})

module.exports = router;