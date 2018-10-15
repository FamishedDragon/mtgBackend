const Joi = require('joi')
const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    name: {type: String, required: true},
    setID: Number,
    power: Number,
    toughness: Number,
    cardType: String,
    subType: String,
    tags: [ String ]
})

export const Card = mongoose.model('Card', cardSchema)

export async function createCard (card) {
    // const card = new Card({
    //     name: 'Lightning Bolt',
    //     setID: 1,
    //     power: null,
    //     toughness: null,
    //     cardType: 'Instant',
    //     subType: null,
    //     tags: [ 'Burn' ]
    // })

    // Validation is automatic when Mongoose trys to save to database
    // Will throw an exception
    // if (!validateCard(card)) {
    //     return
    // }

    try {
        const result = await card.save()
        console.log('Result', result)
    }
    catch(ex) {
        console.log('ERROR:', ex.message)
    }
}

export function testFunc() {
    console.log('SUCCESS')
}

export async function getCards() {
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
    return allCards
}

export async function getCardByFilter() {
    let pageNumber = 2
    let pageSize = 10
    const cards = await Card
        .find({power: 1})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({name: 1})
        .select({name: 1, tags: 1})
}

// Querry first update method
export async function updateCard(id) {
    const card = Card.findByID(id)
    if (!card) {
        console.log(`No such ID: ${id}`)
        return
    }

    card.setID = 2
    const result = Card.save()
    console.log(result)
}

// Update from DB update method
export async function updateCardInDB(id) {
    // Can update multiple entries at once with the object passed in
    // Card.update({set: 1}) -> Updates all cards with set ID 1
    // if you want to return what you update, use Card.findByIdAndUpdate(id, {$set}, {new: true})
    const result = Card.update({_id: id},{
        $set: {
            cardType: 'Spell',
            power: null,
            toughness: null
        }
    })

    console.log(result)
}

export async function removeCard(id) {
    // Can update multiple entries at once with the object passed in
    // Card.update({set: 1}) -> Updates all cards with set ID 1
    // if you want to return what you update, use Card.findByIdAndUpdate(id, {$set}, {new: true})
    const result = Card.deleteOne({_id: id})

    console.log(result)
}

export function validateCard(card) {
    return Joi.validate(card, cardSchema)
}
