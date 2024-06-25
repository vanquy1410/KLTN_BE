const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const { JWT_SECRET, auth } = require('../config')
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken');

const GooglePlusTokenStrategy = require('passport-google-plus-token')

//Passport JWT
const Account = require('../models/Account.models')
console.log("google client" + process.env.GOOGLE_CLIENT_ID);

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

//Passport Google
passport.use(new GooglePlusTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
}, async(accessToken,refreshToken,profile, done) => {
    try{
        // Check if there is an existing account with the provided Google ID and auth type
        let account = await Account.findOne({
            authGoogleID: profile.id,
            authType: "google",
        });
        
        if (account) return done(null, account);

        // Check if there is an existing account with the same email
        account = await Account.findOne({
            Email: profile.emails[0].value
        });

        if (account) {
            // If the email is found but the Google ID is not set, update the existing account
            account.authGoogleID = profile.id;
            account.authType = 'google';
            await account.save();
            return done(null, account);
        }

        // If no account exists, create a new one
        const newAccount = new Account({
            authType: "google",
            authGoogleID: profile.id,
            Email: profile.emails[0].value,
        });
        
        await newAccount.save();
        
        done(null, newAccount);

    } catch (error) {
        console.log(error);
        done(error, false);
    }
}));
// passport.use(new GooglePlusTokenStrategy({
//     clientID: '395470125815-hvn6sajbo1c7ga5mng8bf1jj781k4u91.apps.googleusercontent.com',
//     clientSecret: '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' 
// }, async(accessToken,refreshToken,profile, done) => {
//     try{
//        console.log('accessToken', accessToken)
//        console.log('refreshToken', refreshToken)
//        console.log('profile', profile)

//        //check whether this current account exists in our database
//        const account = await Account.findOne({
//         authGoogleID: profile.id,
//         authType: "google",
//        });
//        if(account)return done(null, account)
       
//         //if new account
//         const newAccount = await Account({
//             authType: "google",
//             authGoogleID: profile.id,
//             Email: profile.emails[0].value,
//         })
//         await newAccount.save()
//         console.log(newAccount);
//         done(null, newAccount)
//     } catch (error){
//         console.log(error);
//         done(error,false)
//     }
// }))

// Passport Local
passport.use(new LocalStrategy({
    usernameField : 'Email',
    passwordField: 'Password'
}, async (Email, Password, done) => {
   try{
    const account = await Account.findOne({ Email })
   

    if (!account) return done(null, false)

    const isCorrectPassword = await account.isValidPassword(Password)
    console.log(isCorrectPassword)

    if(!isCorrectPassword) return done(null, false)

    done(null, account)
    }catch (error) {
        done(error, false);
    }
}))

// passport.use(new LocalStrategy({
//     usernameField: 'Email',
//     passwordField: 'Password'
// }, async (Email, Password, done) => {

//     console.log('gdhsag');
//     try {
//         const account = await Account.findOne({ Email });

//         if (!account) {
//             console.log('Email not found:', Email);
//             return done(null, false, { message: 'Email not found' });
//         }

//         const isCorrectPassword = await account.isValidPassword(Password);

//         if (!isCorrectPassword) {
//             console.log('Incorrect password for Email:', Email);
//             return done(null, false, { message: 'Incorrect password' });
//         }

//         console.log('User authenticated:', Email);
//         return done(null, account);
//     } catch (error) {
//         console.error('Error in LocalStrategy:', error);
//         return done(error, false);
//     }
// }));

