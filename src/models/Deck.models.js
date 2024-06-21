const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeckSchema = new Schema({
    Name: {
        type: String
    },
    Description: {
        type: String
    },
    Total: {
        type: Number,
        default: 0
    },
    Owner: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    }
})

const Deck = mongoose.model('Deck', DeckSchema)
module.exports = Deck