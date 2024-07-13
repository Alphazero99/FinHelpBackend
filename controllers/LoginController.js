import bcryptjs from "bcryptjs";
import SignUpUser from "../models/SignupSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({
    path:".env"
})
export const Login = async(req,res)=>{
    try{
        const {Username ,Password}=req.body;
        if( !Username | !Password ){
            return res.status(401).json({
                message: "All fields are necessary",
                success: false
            })
        }

        const user = await SignUpUser.findOne({Username});
        if(!user){
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        const isMatch = await bcryptjs.compare(Password , user.Password);
        if(!isMatch){
            return res.status(401).json({
                message: "Incorect credentials",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });
      
       
        return res.status(201).cookie("token", token, { expiresIn: "1d", httpOnly: true }).json({
            message: `Welcome back ${Username}`,
            success: true,
            token
        })



    }catch(error){
        console.log(error);
    }
}

export const logout = (req, res) => {

    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
        message: "user logged out successfully.",
        success: true
    })

    
}
