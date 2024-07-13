import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SignUpSchema = new Schema({
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Username: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    ConfirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return value === this.Password;
            },
            message: 'Passwords do not match'
        }
    },
    JoinDate: {
        type: Number,
        required:false,
    }
});

const SignUpUser = mongoose.model('SignUpUser', SignUpSchema);

export default SignUpUser;