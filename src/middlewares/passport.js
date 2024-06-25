const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
require('dotenv').config();

const Account = require('../models/Account.models');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    try {
        const account = await Account.findById(payload.sub);
        if (!account) return done(null, false);

        done(null, account);
    } catch (error) {
        done(error, false);
    }
}));

passport.use(new GooglePlusTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let account = await Account.findOne({ authGoogleID: profile.id, authType: "google" });
        
        if (account) return done(null, account);

        account = await Account.findOne({ Email: profile.emails[0].value });

        if (account) {
            account.authGoogleID = profile.id;
            account.authType = 'google';
            await account.save();
            return done(null, account);
        }

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

passport.use(new LocalStrategy({
    usernameField: 'Email',
    passwordField: 'Password'
}, async (Email, Password, done) => {
    try {
        const account = await Account.findOne({ Email });

        if (!account) return done(null, false);

        const isCorrectPassword = await account.isValidPassword(Password);

        if (!isCorrectPassword) return done(null, false);

        done(null, account);
    } catch (error) {
        done(error, false);
    }
}));

module.exports = passport;
