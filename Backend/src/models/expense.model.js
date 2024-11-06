import mongoose,{Schema} from "mongoose";

const expenseSchema=new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        date:{
            type:Date
        },
        category:{
            type:String,
            required:true
        },
        subcategory:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

export const Expense = mongoose.model("Expense",expenseSchema);