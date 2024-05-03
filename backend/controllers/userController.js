import User from '../models/userModel.js'
import asyncHandler from '../middlewares/asyncHandler.js'
import bcrypt from 'bcryptjs'
import createToken from '../utils/createToken.js'

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    
    if(!(username && email && password)) {
        throw new Error("Please provide values for all inputs.")
    }

    // check for user existence (by email)
    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400).send("User already exists")
    }

    // encyrpt password (otherwise would be able to see via the response)
    // use salt to insert random chars into the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({username, email, password: hashedPassword})

    try {
        await newUser.save()
        createToken(res, newUser._id)

        // send back response to user indicating success
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        })

    } catch(err) {
        res.status(400)
        throw new Error("Invalid user data")
    }


})

// login user by verifying password
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    const existingUser = await User.findOne({email})

    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)

        if (isPasswordValid) {
            createToken(res, existingUser._id)
            
            // send response back to user
            res.status(201).json({
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin,
            })
            return;
        }
    }
})

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({message: "Logged out successfully"})
})

const getAllUsers = asyncHandler( async (req,res) => {
    const users = await User.find({})
    res.json(users)
})

const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json ({
            _id: user._id,
            username: user.username,
            email: user.email
        })
    } else {
        res.status(404)
        throw new Error("user not found")
    }
}) 

const updateCurrentUserProfile = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        // update to new username if provided
        // likewise for email and passw
        user.username = req.body.username || user.username
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin || user.isAdmin
        
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(req.body.password, salt)
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    }
    else {
        res.status(404)
        throw new error("user not found")
    }
})

// Admin controllers

const deleteUserById = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id)

    if(user) {
        // error, cannot delete amdin
        if(user.isAdmin) {
            res.status(400)
            throw new Error('Cannot delete admin user')
        }

        await User.deleteOne({_id: user._id})
        res.json({message: "user removed"})
    } else {
        res.status(404)
        throw new Error("User not found!")
    }

})

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')

    if (user) {
        res.json(user)
    }
    else {
        res.status(401)
        throw new Error("User Not found")
    }
})

const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password")

    if(user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    }else {
        res.status(401)
        throw new Error("User not found")
    }
})

export {
    createUser,
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById,
}