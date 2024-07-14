import {CalculatorUser} from "../models/CalculatorSchema"

export const calculator = async(req , res) =>{
    try {
        const {name , amount} = req.body;
        if(!name | !amount){
            return res.status(401).json({
                message:"All fields need to be filled",
                success:false
            })
        }
        
    } catch (error) {
        
    }
}