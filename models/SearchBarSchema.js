import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SearchBarSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    }
})
module.exports = SearchBarUser = mongoose.model('SearchBarUser',SearchBarSchema);