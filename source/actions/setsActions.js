const Joi = require('joi')
const mongoose = require('mongoose')

const setSchema = new mongoose.Schema({
    name: String,
    symbol: String,
    abbreviation: String,
    releaseYear: Number
})

export const Set = mongoose.model('Set', setSchema)

export async function createSet (set) {
    if (!validateSet(set)) {
        return
    }

    const result = await set.save()
    //console.log('Result', result)
}

export async function getSets() {
    // Comparison Operators
    // gt, gte, lte, eq, ne, in, nin
    // Logical Operators
    // or, and
    // Regular Expressions
    // /^string/ == find anything that starts with string
    // /string$/ == find anything that ends with string
    // /.*string.*/ == find anything with string
    const allSets = await Set.find()
    return allSets
}

export async function getSetByFilter() {
    let pageNumber = 2
    let pageSize = 10
    const sets = await Set
        .find({releaseYear: 1})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({name: 1})
        .select({name: 1, releaseYear: 1})
}

// Querry first update method
export async function updateSet(id) {
    const set = Set.findByID(id)
    if (!set) {
        console.log(`No such ID: ${id}`)
        return
    }

    set.setID = 2
    const result = Set.save()
}

// Update from DB update method
export async function updateSetInDB(id) {
    // Can update multiple entries at once with the object passed in
    // Card.update({set: 1}) -> Updates all cards with set ID 1
    const result = Set.update({_id: id},{
        $set: {
            releaseYear: 1993,
            name: 'newSetName'
        }
    })

    console.log(result)
}

export function validateSets (set) {
    return Joi.validate(set, setSchema)
}
