import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CalculatorSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    amount:{
        type:Number,
        required:true,
    }
})
module.exports = CalculatorUser = mongoose.model('CalculatorUser',CalculatorSchema);