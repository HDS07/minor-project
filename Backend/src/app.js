import express from "express"
import cors from "cors" //Cross Origin Resource Sharing
import cookieParser from "cookie-parser" //Used to Access and Set Cookie in User Browser

const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//app.use(express.something) //To set express configuration
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//Importing Routes
import userRouter from "./routes/user.routes.js"

//Routes Declaration
app.use("/api/v1/users",userRouter)
//http://localhost:8000/users/register

export {app}