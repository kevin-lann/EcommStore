import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from './asyncHandler.js'

const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    // read JWT from the JWT cookie
    token = req.cookies.jwt

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId).select('-password')
            next()
        } catch (err) {
            res.status(401)
            throw new Error('Not Authorized, token failed')
        }
    }
    else {
        res.status(401)
        throw new Error('Not Authorized, no token ')
    }
})

const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    }
    else {
        res.status(401)
        throw new Error('Not Authorized as an admin ')
    }
}

export { authenticate, authorizeAdmin }