const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const { JWT_SECRET } = require('../config')
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken');



const Account = require('../models/Account.models')

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: JWT_SECRET
}, async(payload, done) => {
    try{
        const account = await Account.findById(payload.sub)
        if(!account) return done(null, false)
        
        done(null, account)

    } catch (error){
        done(error,false)
    }
}))

//Passport Local
// passport.use(new LocalStrategy({
//     usernameField : 'Email'
// }, async (Email, Password, done) => {
//    try{
//     const account = await Account.findOne({ Email })
   

//     if (!account) return done(null, false)

//     const isCorrectPassword = await account.isValidPassword(Password)
//     console.log(isCorrectPassword)

//     if(!isCorrectPassword) return done(null, false)

//     done(null, account)
//     }catch (error) {
//         done(error, false);
//     }
// }))

passport.use(new LocalStrategy({
    usernameField: 'Email',
    passwordField: 'Password'
}, async (Email, Password, done) => {

    console.log('gdhsag');
    try {
        const account = await Account.findOne({ Email });

        if (!account) {
            console.log('Email not found:', Email);
            return done(null, false, { message: 'Email not found' });
        }

        const isCorrectPassword = await account.isValidPassword(Password);

        if (!isCorrectPassword) {
            console.log('Incorrect password for Email:', Email);
            return done(null, false, { message: 'Incorrect password' });
        }

        console.log('User authenticated:', Email);
        return done(null, account);
    } catch (error) {
        console.error('Error in LocalStrategy:', error);
        return done(error, false);
    }
}));

