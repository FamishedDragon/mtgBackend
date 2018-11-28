import express from'express'
import Joi from 'joi'
import {httpCode} from "../util/constants";
import {getSets, updateSetInDB, validateSets} from "../actions/setsActions";

const router = express.Router()

// const setSchema = {
//     id: Joi.number(),
//     name: Joi.string().min(3).required(),
//     symbol: Joi.string().min(3).required(),
//     abbreviation: Joi.string().required(),
//     releaseYear: Joi.number().min(4).required()
// }
//
// var sets = [
//     {id: 1, name: 'Alpha', symbol: 'alpha.png', abbreviation: 'A', releaseYear: 1993},
//     {id: 2, name: 'Beta', symbol: 'beta.png', abbreviation: 'B', releaseYear: 1993},
//     {id: 3, name: 'Unlimited', symbol: 'unlimited.png', abbreviation: 'U', releaseYear: 1993},
//     {id: 4, name: 'Arabian Nights', symbol: 'arabian_nights.png', abbreviation: 'ARN', releaseYear: 1993},
//     {id: 5, name: 'Antiquities', symbol: 'antiquities.png', abbreviation: 'ANT', releaseYear: 1993},
// ]

// GET all sets
router.get('/', (req, res) => {
    getSets()
        .then(result => res.send(result))
})

// POST new sets
router.post('/', (req, res) => {
    //TODO: This will post a full list of sets rather than one new set. Not what I should be doing
    getSets()
        .then( sets => {
            const {error} = validateSets(req.body)
            if (error) {
                res.status(httpCode.error).send(error.details[0].message)
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
})

// Modify existing set
router.put('/:id', (req, res) => {
    // const set = sets.find(c => c.id === parseInt(req.params.id))
    // if (!set) {
    //     return res.status(httpCode.doesNotExist).send(`ERROR: Set with ID ${req.params.id} does not exist`)
    // }
    // const { error } = validateSets(req.body)
    // if (error) {
    //     return res.status(httpCode.error).send(error.details[0].message)
    // }

    updateSetInDB(req.params.id, req.body.set)
        .then(response => console.log('SET SAVED', response))
        .catch(err => console.log('ERROR SAVING SET', err))

    // set.name = req.body.name
    // res.send(set)
})

// DELETE by ID
router.delete('/:id', (req, res) => {
    // const set = sets.find(s => s.id === parseInt(sets.params.id))
    // if (!set) {
    //     return res.status(httpCode.doesNotExist).send(`ERROR: Set with ID ${sets.params.id} does not exist`)
    // }
    //
    // const index = sets.indexOf(set)
    // sets.splice(index, 1)
    // res.send(sets)
})

// GET card by ID
router.get('/:id', (req, res) => {
    getSets()
        .then(sets => {
            const set = sets.find(c => c.id === parseInt(req.params.id))
            if (set) {
                res.send(set)
            }
            else {
                return res.status(httpCode.doesNotExist).send(`ERROR: Card with ID ${req.params.id} does not exist`)
            }
        })
        .catch(err => {
            console.log(`ERROR GETTING SET WITH ID ${req.params.id}`, err)
            return res.status(httpCode.error).send(`ERROR: Card with ID ${req.params.id}: ${err}`)
        })
})

export default router;