import FaqUser from "../models/FaqSchema.js"

export const faq = async(req , res) =>{
    try {
        const {question} = req.body;
        if(!question){
            return res.status(401).json({
                message:"Please type a question",
                success:false
            })
        }

        await FaqUser.create({
            question
        })

        return res.status(400).json({
            message:"Question posted successfully",
            success: true
        })
        
    } catch (error) {
        
    }
}