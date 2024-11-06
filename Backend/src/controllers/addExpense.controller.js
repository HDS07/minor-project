import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Expense} from "../models/expense.model.js"

const addExpense = asyncHandler(async(req,res)=>{
    const {date,amount,category,subcategory}=req.body

    if(!date){
        throw new ApiError(400,"Date Field is Required")
    }
    if(!amount || amount==0){
        throw new ApiError(400,"Amount Required for modification")
    }

    const user = await User.findById(req.user?._id)
    const userId=req.user._id;

    const newExpense = await Expense.create({
        userId,
        amount,
        date,
        category,
        subcategory
    })
    user.expense+=parseFloat(amount)
    const income=user.income || 0
    const expense=user.expense || 0
    user.balance=income-expense
    await user.save({validateBeforeSave:false})

    await User.findByIdAndUpdate(
        userId,
        {$push:{expenses:newExpense._id}},
        {new:true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(201,{},"Expense Added Successfully")
    )

})

export{
    addExpense,
}