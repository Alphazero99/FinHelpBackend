import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FaqSchema = new Schema({
    question:{
        type:String,
        required:true,
    },
    answer: {
      type: String,
      required: true
    }
    
})
const  FaqUser = mongoose.model('FaqUser',FaqSchema);



export default FaqUser;