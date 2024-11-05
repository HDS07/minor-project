import {Router} from "express"
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
} from "../controllers/user.controller.js"
import {
    addIncome
}from "../controllers/addIncome.controller.js"
import {
    addExpense
}from "../controllers/addExpense.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()
router.route("/register")
.get((req,res)=>{
    res.render('register', {
        title: 'Expense Tracker - Register',
        emailExists: false, // Set to true if an error occurred
        emailError: false,  // Set to true if there's an email error
        passwordError: false, // Set to true if passwords don't match
        name: '',         // Set this to prefill the name field
        username: '',     // Set this to prefill the username field
        email: ''         // Set this to prefill the email field
    });
})
.post(registerUser)

router.route("/login")
.get((req, res)=>{
    res.render('login', { 
        title: 'Expense Tracker - Login',
        email: '' 
    });
})
.post(loginUser)

//Secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/addIncome").patch(verifyJWT,addIncome)
router.route("/addExpense").patch(verifyJWT,addExpense)
router.route("/dashboard")
.get((req,res)=>{
    const user = {
        username: 'JohnDoe',
        balance: 5000,
        expenses: []
    };
    res.render('dashboard/dash',{user})
})

export default router