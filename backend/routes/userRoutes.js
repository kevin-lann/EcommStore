import express from 'express'
import { 
    createUser, 
    loginUser, 
    logoutCurrentUser,
    getAllUsers, 
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById,
} from '../controllers/userController.js'
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js'


const userRoute = express.Router()

userRoute.route('/')
    .post(createUser)
    .get(authenticate, authorizeAdmin, getAllUsers)

userRoute.route("/auth").post(loginUser)
userRoute.route("/logout").post(logoutCurrentUser)

userRoute.route("/profile")
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUserProfile)

// Admin Routes _-------------------------

userRoute.route("/:id")
    .delete(authenticate, authorizeAdmin, deleteUserById)
    .get(authenticate, authorizeAdmin, getUserById)
    .put(authenticate, authorizeAdmin, updateUserById)

export default userRoute