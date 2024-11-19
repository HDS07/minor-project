import mongoose,{Schema} from "mongoose";

const incomeSchema=new Schema(
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
        }
    },
    {
        timestamps:true
    }
)

export const Income = mongoose.model("Income",incomeSchema);