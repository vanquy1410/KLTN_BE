const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const { JWT_SECRET } = require('../config')

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