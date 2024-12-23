import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username:{
            type: String,
            required:true,
            unique:true,
            trim:true,
            index:true
        },
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullName:{
            type: String,
            required:true,
            trim:true,
            index:true
        },
        password:{
            type:String,
            required:[true,'Password is required']
        },
        refreshToken:{
            type:String
        },
        finCoin:{
            type:Number,
            default:0
        },
        balance:{
            type:Number,
            default:0
        },
        income:{
            type:Number,
            default:0
        },
        expense:{
            type:Number,
            default:0
        },
        expenses:[
            {
                type:Schema.Types.ObjectId,
                ref:'Expense'
            }
        ],
        incomes:[
            {
                type:Schema.Types.ObjectId,
                ref:'Income'
            }
        ],
        goals:[
            {
                goalId:{
                    type:Number,
                    required:true,
                    default:0
                },
                goal:{
                    type:String,
                    required:true,
                    trim:true
                },
                amount:{
                    type:Number,
                    required:true
                },
                achieve:{
                    type:Boolean,
                    default:false
                },
                failed:{
                    type:Boolean,
                    default:false
                }
            }
        ]
    },
    {
        timestamps:true
    }
);

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next()
    this.password= await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this.id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);