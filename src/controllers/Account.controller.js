const Account = require("../models/Account.models");
const bcrypt = require("bcrypt");

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
    const { Email } = req.params;
    try {
        const accont = await Account.findOne({ Email: Email });
        if (!accont) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.status(200).json(accont);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
const getAccountDecks = async (req, res, next) => {
    const { Email } = req.value.params;

    try {
        // Assuming Account model has a reference to Decks similar to the User model example
        const account = await Account.findOne({ Email: Email }).populate('decks');

        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }

        return res.status(200).json({ decks: account.decks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
const newAccountDeck = async (req, res, next) => {
    const { Email } = req.value.params;

    // Create a new deck
    const newDeck = new Deck(req.value.body);

    // Get account
    const account = await Account.findOne({ Email: Email });

    if (!account) {
        return res.status(404).json({ error: "Account not found" });
    }

    // Assign account as a deck's owner
    newDeck.owner = account;

    // Save the deck
    await newDeck.save();

    // Add deck to account's decks array 'decks'
    account.decks.push(newDeck._id);

    // Save the account
    await account.save();

    res.status(201).json({ deck: newDeck });
};

const replaceAccount = async (req, res, next) => {
    const { Email } = req.value.params;

    const newAccountData = req.value.body;

    try {
        const result = await Account.findOneAndUpdate({ Email: Email }, newAccountData, { new: true });

        if (!result) {
            return res.status(404).json({ error: "Account not found" });
        }

        return res.status(200).json({ success: true, account: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const addAccount = async (req, res) => {
    const { UserAccount, Email, Password, Role, PhoneNumber, Address } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(Password, 10);
        const account = new Account({
            UserAccount: UserAccount,
            Email: Email,
            Password: hashedPassword,
            Role: Role, // Added Role
            PhoneNumber: PhoneNumber, // Added PhoneNumber
            Address: Address // Added Address
        });
        await account.save();
        res.status(200).json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const updateAccountByEmail = async (req, res) => {
    const { Email } = req.params; // Assuming email is passed as a URL parameter
    const { UserAccount, Password, Role, PhoneNumber, Address } = req.body;
    
    try {
        const account = await Account.findOne({ Email: Email }); // Find account by email instead of id
        
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        
        if (UserAccount !== undefined) {
            account.UserAccount = UserAccount;
        }
        
        if (Password) {
            account.Password = await bcrypt.hash(Password, 10);
        }

        if (Role !== undefined) {
            account.Role = Role;
        }

        if (PhoneNumber !== undefined) {
            account.PhoneNumber = PhoneNumber;
        }

        if (Address !== undefined) {
            account.Address = Address;
        }
        
        await account.save();
        
        res.status(200).json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

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
module.exports = {
    findAll,
    getAccountDecks,
    getOne,
    addAccount,
    updateAccountByEmail,
    deleteAccount,
    changePassword,
    newAccountDeck
};