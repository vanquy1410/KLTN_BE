const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');
const AccountSchema = new Schema({
    UserAccount: {
        type: String,
        // required: true
    },
    Password: {
        type: String,
        // required: true
    },
    authGoogleID:{
        type: String,
        default: null
    },
    authFacebookID:{
        type: String,
        default: null
    },
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local',
    },
    Role: {
        type: String,
        // required: true
    },
    PhoneNumber: {
        type: String,
        // required: true
    },
    Address: {
        type: String,
        // required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Deck'
    }]
});

// mã hoá pass của đăng ký
AccountSchema.pre('save', async function(next){
    try {
       if(this.authType !== 'local') next()

        //Generate a salt 
        const salt = await bcrypt.genSalt(10);

        //Generate a password hash (salt + hash)
        const passwordHashed = await bcrypt.hash(this.Password, salt);

        //Re-assign password hashed
        this.Password = passwordHashed;

        next();
    } catch (error) {
        next(error);
    }
})

// AccountSchema.methods.isValidPassword = async function(newPassword){
//     try{
//         return await bcrypt.compare(newPassword, this.Password)
//     }catch(error){
//         throw new Error(error)
//     }
// }

AccountSchema.methods.isValidPassword = async function(newPassword) {
    return await bcrypt.compare(newPassword, this.Password);
};

const Account = mongoose.model("Account", AccountSchema, "Account");
console.log("Account model created");


module.exports = Account;
