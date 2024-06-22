const Account = require("../models/Account.models");
const Deck = require("../models/Deck.models");
const bcrypt = require("bcrypt");

const Joi = require('@hapi/joi')
const idSchema = Joi.object().keys({
id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})

const findAll = async (req, res) => {
    try {
        const accounts = await Account.find();
        console.log("found accounts", accounts);
        res.status(200).json(accounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const getOne = async (req, res) => {
    const { id } = req.value.params; // Corrected line

    const account = await Account.findById(id);

    return res.status(200).json({ account });
};

const getAccountDecks = async (req, res, next) => {
    const { id } = req.params; // Correctly access params directly from req

    try {
        // Get user
        const account = await Account.findById(id).populate('decks');
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }

        return res.status(200).json({ decks: account.decks });
    } catch (error) {
        next(error);  // Pass error to error handling middleware
    }
};

const newAccountDeck = async (req, res, next) => {
    const { id } = req.params

    // Create a new deck
    const newDeck = new Deck(req.body)

    // Get account
    const account = await Account.findById(id)

    // Assign account as a deck's owner
    newDeck.owner = account

    // Save the deck
    await newDeck.save()

    // Add deck to account's decks array 'decks'
    account.decks.push(newDeck._id)

    // Save the user
    await account.save()

    res.status(201).json({deck: newDeck})
}

const newAccount = async (req, res, next) => {
    const newAccount = new Account(req.value.body)

    await newAccount.save()

    return res.status(201).json({account: newAccount})
}

const updateAccount = async (req, res) => {
    // number of fields
    const { id } = req.value.params

    const newAccount = req.value.body

    const result = await User.findByIdAndUpdate(id, newAccount)

    return res.status(200).json({success: true})
}

const deleteAccount = async (req, res) => {
    const { Email } = req.params;
    try {
        const result = await Account.findOneAndDelete({ Email: Email });
        if (!result) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.status(200).json({ message: "Account deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const changePassword = async (req, res) => {
    const { Email, newPassword } = req.body;
    try {
        const accont = await Account.findOne({ Email: Email });
        if (!accont) {
            return res.status(404).json({ error: "Account not found" });
        }
        accont.password = await bcrypt.hash(newPassword, 10);
        await accont.save();
        res.status(200).json({ message: "Password changed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const replaceAccount = async (req, res, next) => {
    // enforce new user to old user
    const { id } = req.value.params

    const newAccount = req.value.body

    const result = await Account.findByIdAndUpdate(id, newAccount)

    return res.status(200).json({success: true})
}

module.exports = {
    findAll,
    getOne,
    newAccount,
    updateAccount,
    deleteAccount,
    changePassword,
    getAccountDecks,
    newAccountDeck,
    replaceAccount
  };