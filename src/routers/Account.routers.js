const express = require("express");
const accountController = require("../controllers/Account.controller");

const router = express.Router();

// Route to find all accounts
router.get("/findall", accountController.findAll);

// Route to get a single account by Email
router.get("/getOne/:Email", accountController.getOne);

// Route to add a new account
router.post("/addAccount", accountController.addAccount);

// Route to update an account by Email
router.put("/updateAccount/:Email", accountController.updateAccountByEmail);

// Route to delete an account by Email
router.delete("/deleteAccount/:Email", accountController.deleteAccount);

// Route to change the password of an account
router.put("/changePassword/:Email", accountController.changePassword);

// Route to get all decks of an account
router.get("/:Email/decks", accountController.getAccountDecks);

// Route to add a new deck to an account
router.post("/:Email/decks", accountController.newAccountDeck);

module.exports = router;