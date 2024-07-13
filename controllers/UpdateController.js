import SignUpUser from "../models/SignupSchema.js";
import bcrypt from "bcrypt";

export const UpdateUsername = async(req , res) => {
    try {
        const {Username , NewUsername , Password} = req.body;
        if(!Username || !NewUsername || !Password){
            return res.status(401).json({
                message:"All fields are necessary",
                success:false
            })
        }
        
        const user = await SignUpUser.findOne({Username})

        if(!user){
            return res.status(401).json({
                message:"User not found",
                success:false
            })
        }

        user.Username = NewUsername

        await user.save()

        return res.status(201).json({
            message:"Username updated successfully",
            success:true,
            user
        })

        
    } catch (error) {
        console.log(error)
    }
}

export const UpdatePassword = async(req , res) => {
    try {
        const {Username , NewPass , CurrPass} = req.body;

        if(!Username || !NewPass || !CurrPass){
            return res.status(401).json({
                message:"All fields are necessary",
                success:false
            })
        }

        const user = await SignUpUser.findOne({Username})

        if(!user){
            return res.status(401).json({
                message:"User does not exist",
                success:false
            })
        }

        const salt = await bcrypt.genSalt(16);
        const Hashedpass = await bcrypt.hash(NewPass, salt);

        user.Password = Hashedpass
        user.ConfirmPassword = Hashedpass

        await user.save()

        return res.status(201).json({
            message:"Password updated successfully",
            success:true,
            user
        })


    } catch (error) {
        console.log(error)
    }
}

