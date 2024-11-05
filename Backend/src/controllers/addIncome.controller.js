import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const addIncome = asyncHandler(async(req,res)=>{
    const {date,amount}=req.body

    if(!date){
        throw new ApiError(400,"Date Field is Required")
    }
    if(!amount || amount==0){
        throw new ApiError(400,"Amount Required for modification")
    }

    const user = await User.findById(req.user?._id)

    user.income=amount
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(201,{},"Income Added Successfully")
    )

})

export{
    addIncome,
}