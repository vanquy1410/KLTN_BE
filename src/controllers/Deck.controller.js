/**
 * We can interact with mongoose in three diffirent ways:
 * [v] Callback
 * [v] Promises
 * [v] Async/await (Promises)
 */

const Deck = require('../models/Deck.models')
const Account = require('../models/Account.models')

const deleteDeck = async (req, res, next) => {
    try {
        const { deckID } = req.value.params;

        // Get a deck
        const deck = await Deck.findById(deckID);
        if (!deck) {
            return res.status(404).json({ success: false, message: "Deck not found" });
        }
        const ownerID = deck.owner;

        // Get the owner
        const owner = await Account.findById(ownerID);
        if (!owner) {
            return res.status(404).json({ success: false, message: "Owner not found" });
        }

        // Remove the deck
        await Deck.findByIdAndDelete(deckID);

        // Remove deck from owner's decks list
        owner.decks.pull(deckID);
        await owner.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};


const getDeck = async (req, res, next) => {
    const deck = await Deck.findById(req.value.params.deckID)

    return res.status(200).json({deck})
}

const index = async (req, res, next) => {
    const decks = await Deck.find({})

    return res.status(200).json({decks})
}

const newDeck = async (req, res, next) => {
   // Find owner
   const owner = await Account.findById(req.value.body.owner)

   // Create a new deck
    const deck = req.value.body
    delete deck.owner

    deck.owner = owner._id
    const newDeck = new Deck(deck)
    await newDeck.save()

    // Add newly created deck to the actual decks
    owner.decks.push(newDeck._id)
    await owner.save()

    return res.status(201).json({deck: newDeck})
}

const replaceDeck = async (req, res, next) => {
    const { deckID } = req.value.params
    const newDeck = req.value.body
    const result = await Deck.findByIdAndUpdate(deckID, newDeck)
    // Check if put account, remove deck in account's model
    return res.status(200).json({ success: true })
}

const updateDeck = async (req, res, next) => {
    const { deckID } = req.value.params
    const newDeck = req.value.body
    const result = await Deck.findByIdAndUpdate(deckID, newDeck)
    // Check if put account, remove deck in account's model
    return res.status(200).json({ success: true })
}

module.exports = {
    deleteDeck,
    getDeck,
    index,
    newDeck,
    replaceDeck,
    updateDeck
}