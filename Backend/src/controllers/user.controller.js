import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import {Expense} from "../models/expense.model.js"

const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave:false })

        return {accessToken,refreshToken}

    }catch(error){
        return res.status(500).json(
            new ApiError(500,"Something Went Wrong while generating refresh and access token")
        )
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    console.log(req.body);
    //get details from frontend
    //validation - not empty
    //check if user already exists : username , email
    //check for images , check for avatar
    //upload them to cloudinary , avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation 
    //return res

    const {fullName, email,username , password} = req.body
    console.log(fullName);
    //console.log("email :- ",email);

    if(
        [fullName,email,username,password].some((field)=>field?.trim() === "")
    ){
        return res.status(400).json(
            new ApiError(400,"All Fields are Required")
        )
    }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        return res.status(409).json(
            new ApiError(409,"User with email or username already exists")
        )
    }
    const user = await User.create({
        fullName,
        email,
        password,
        username
    })
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        return res.status(500).json(
            new ApiError(500,"Something went Wrong While Registering the User")
        )
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User Registered Successfully")
    )
})

const loginUser = asyncHandler(async(req,res)=>{
    //req body -> data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie

    const {email,username,password} = req.body
    if(!username && !email){
        return res.status(400).json(
            new ApiError(400,"Username Or Email is Required")
        )
    }

    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        return res.status(404).json(
            new ApiError(404,"User does not Exist")
        )
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        return res.status(401).json(
            new ApiError(401,"Invalid user Credentials")
        )
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User Logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User Logged Out")
    )
})

const refreshAccessToken= asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        return res.status(401).json(
            new ApiError(401,"No Refresh Token Found")
        )
    }

    try{
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            return res.status(401).json(
                new ApiError(401,"Invalid refresh Token")
            )
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            return res.status(401).json(
                new ApiError(401,"Refresh Token in Expired or Used")
            )
        }
    
        const options = {
            httpOnly:true,
            secure:true
        }
    
        const {accessToken , newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken:newRefreshToken},
                "Access token Refreshed"
            )
        )
    }catch(error){
        return res.status(401).json(
            new ApiError(401,error?.message || "Invalid Refresh Token")
        )
    }

})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        return res.status(400).json(
            new ApiError(400,"Invalid old Password")
        )
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Password changed Successfully")
    )

})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(200,req.user,"Current user fetched successfully")
    )
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullName,email} = req.body

    if(!fullName || !email){
        return res.status(400).json(
            new ApiError(400,"All Fields are Required")
        )
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            //MongoDb Operators
            $set:{
                fullName:fullName,
                email: email
            }

        },
        {new:true} //Updated Data is returned
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"Account details Updated Successfully"))
})

const renderDashboard = asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const user=await User.findById(userId)
    if(!user){
        return res.status(404)
        .json(new ApiError(404,null,"User not Found"))
    }
    res.render('dashboard/dash',{user})
})

const getHistory = asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const expense=await Expense.find({userId:userId});
    if(!expense){
        return res.status(404)
        .json(new ApiError(404,null,"Fail to Retrieve Data from User"))
    }
    return res.status(200)
    .json(new ApiResponse(200,expense,"History Retrieve Successful"))
})

const getCategory = asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const expensebycategory = await Expense.aggregate([
        {$match:{userId:userId}},
        {$group:{_id:"$category",totalAmount:{$sum:"$amount"}}}
    ])
    const categorydata=expensebycategory.map(expense=>({
        category:expense._id,
        amount:expense.totalAmount
    }))
    if(!categorydata || categorydata.length===0){
        return res.status(500)
        .json(new ApiError(500,null,"Fail to Retrieve Data from Database"))
    }
    return res.status(200)
    .json(new ApiResponse(200,categorydata,"Data Retrieve Successful"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    renderDashboard,
    getHistory,
    getCategory
}