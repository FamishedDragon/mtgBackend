const Joi = require('joi')
const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    name: String,
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

    if (!validateCard(card)) {
        return
    }

    const result = await card.save()
    console.log('Result', result)
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
    const result = Card.update({_id: id},{
        $set: {
            cardType: 'Spell',
            power: null,
            toughness: null
        }
    })

    console.log(result)
}

export function validateCard(card) {
    return Joi.validate(card, cardSchema)
}
