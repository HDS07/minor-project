import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const goalAchieved = asyncHandler(async(req,res)=>{
    const {goalId}=req.body

    if(!goalId){
        return res.status(400).json(
            new ApiError(400,"GoalId is Not Given")
        )
    }

    const user = await User.findById(req.user?._id)
    const goal = user.goals.find((g)=> g.goalId === goalId)

    if(!goal){
        return res.status(400).json(
            new ApiError(400,"No Goals Found!!!")
        )
    }

    if(goal.achieve==true){
        return res.status(400).json(
            new ApiError(400,"Goal Already Achieved , Can't Achieved Again")
        )
    }

    if(goal.failed==true){
        return res.status(400).json(
            new ApiError(400,"Goal is Failed Already")
        )
    }

    goal.achieve=true;
    const rewards = parseFloat(Math.floor(goal.amount*0.15));
    user.finCoin+=rewards

    await user.save();

    return res
    .status(201)
    .json(
        new ApiResponse(201,{},"Great Work!!! ")
    )
})

const goalFailed = asyncHandler(async(req,res)=>{
    const {goalId}=req.body

    if(!goalId){
        return res.status(400).json(
            new ApiError(400,"GoalId is Not Given")
        )
    }

    const user = await User.findById(req.user?._id)
    const goal = user.goals.find((g)=> g.goalId === goalId)

    if(!goal){
        return res.status(400).json(
            new ApiError(400,"No Goals Found!!!")
        )
    }

    if(goal.failed==true){
        return res.status(400).json(
            new ApiError(400,"Can't Change Status as Goal is Already Failed")
        )
    }

    if(goal.achieve==true){
        return res.status(400).json(
            new ApiError(400,"Can't Change Status as Goal is Already Achieved")
        )
    }

    goal.failed=true;

    await user.save();

    return res
    .status(201)
    .json(
        new ApiResponse(201,{},"Its Ok Try to Save Next Time!!! ")
    )
})

export{
    goalAchieved,
    goalFailed
}