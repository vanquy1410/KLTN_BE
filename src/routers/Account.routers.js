const express = require("express");

const accountController = require("../controllers/Account.controller");

const router = express.Router();

const { validateBody, validateParam, schemas } = require('../helpers/routerHelper')

const passport = require('passport')
const passportConfig = require('../middlewares/passport')
// router.use(passport.initialize());


router.route('/signup').post(validateBody(schemas.authSignUpSchema), accountController.signUp)
// router.route('/signin').post(validateBody(schemas.authSignInSchema), passport.authenticate('local', { session : false }), accountController.signIn)

router.route('/signin').post(
    validateBody(schemas.authSignInSchema), 
    passport.authenticate('local', { session : false }), 
    accountController.signIn
);

router.route('/secret').get(passport.authenticate('jwt', { session : false}),accountController.secret)

router.route('/')
    .get(accountController.findAll)
    .post(validateBody(schemas.accountSchema), accountController.newAccount)

router.route('/:id')
    .get(validateParam(schemas.idSchema, 'id'), accountController.getOne)
    .put(validateParam(schemas.idSchema, 'id'), validateBody(schemas.accountSchema), accountController.replaceAccount)
    .patch(validateParam(schemas.idSchema, 'id'), validateBody(schemas.accountOptionalSchema), accountController.updateAccount)

// Route to update an account by Email
router.put("/updateAccount/:Email", accountController.updateAccount);

// Route to delete an account by Email
router.delete("/deleteAccount/:Email", accountController.deleteAccount);

// Route to change the password of an account
router.put("/changePassword/:Email", accountController.changePassword);



router.route('/:id/decks')
    .get(validateParam(schemas.idSchema, 'id'), accountController.getAccountDecks)
    .post(validateParam(schemas.idSchema, 'id'), validateBody(schemas.deckSchema), accountController.newAccountDeck)

module.exports = router;