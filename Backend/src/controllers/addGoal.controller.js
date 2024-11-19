import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const addGoal = asyncHandler(async(req,res)=>{
    const {goal,amount}=req.body

    if(!goal || !amount){
        throw new ApiError(404,"Data Field is Required")
    }

    const user = await User.findById(req.user?._id)
    const lastGoal = user.goals[user.goals.length-1]
    const newGoalId = lastGoal?lastGoal.goalId+1:1

    user.goals.push({
        goalId:newGoalId,
        goal:goal,
        amount:amount,
        achieve:false,
        failed:false
    })

    await user.save()

    return res
    .status(200)
    .json(
        new ApiResponse(201,{},"Goal Added Successfully")
    )

})

export{
    addGoal
}