import {Router} from "express"
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    renderDashboard,
    getHistory
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
router.route("/income/addIncome").patch(verifyJWT,addIncome)
router.route("/expense/addExpense").patch(verifyJWT,addExpense)
router.route("/dashboard").get(verifyJWT,renderDashboard)
router.route("/expense")
.get((req,res)=>{
    res.render('dashboard/expense')
})
router.route("/income")
.get((req,res)=>{
    res.render('dashboard/income')
})
router.route("/info")
.get((req,res)=>{
    const user = {
        fullName: "Null",
        email: "null07@gmail.com",
        username: "abcd1234",
    };
    res.render('dashboard/account',{user})
})

router.route("/expense/history").get(verifyJWT,getHistory)

export default router