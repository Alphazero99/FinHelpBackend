import SignUpUser from "../models/SignupSchema.js";
import bcrypt from "bcryptjs";

export const Register = async (req, res) => {
  try {
    const { Email, Username, Password, ConfirmPassword } = req.body;
    if (!Email || !Username || !Password || !ConfirmPassword) {
      return res.status(401).json({
        message: "All fields are necessary",
        success: false
      });
    }

    const SignUp = await SignUpUser.findOne({ Email });
    if (SignUp) {
      return res.status(401).json({
        message: "User already exists",
        success: false
      });
    }

    const User = await SignUpUser.findOne({ Username });
    if (User) {
      return res.status(401).json({
        message: "Username already taken",
        success: false
      });
    }

    if (Password !== ConfirmPassword) {
      return res.status(401).json({
        message: "Passwords do not match",
        success: false
      });
    }

    const salt = await bcrypt.genSalt(16);
    const Hashedpass = await bcrypt.hash(Password, salt);

    try {
      const newUser = new SignUpUser({
        Email,
        Username,
        Password: Hashedpass,
        ConfirmPassword: Hashedpass,
        JoinDate: Date.now()
      });

      await newUser.save();
      
      res.status(201).json({
        message: 'User registered successfully',
        success: true,
        redirectUrl: '/login' 
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
        success: false
      });
    }
  } catch (error) {
    console.log(error);
  }
};
