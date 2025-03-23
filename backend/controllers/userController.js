import validator from 'validator'
import userModel from '../models/userModel.js'
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

//routes for userLogin

const loginUser = async(req,res) => {
    try{
        const {email, password} = req.body
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({
                success: false,
                message: "User not found"
            })
        }
        //if user exist
        const isMatch = await bcrypt.compare(password, user.password)
        //checkPassword
        if(isMatch){
            const token = createToken(user._id);
            return res.json({
                success: true,
                token
            })
        }else{
            return res.json({
                success: false,
                message: "Password is incorrect"
            })
        }
    }
    catch(error){
        console.error(error)
        return res.json({
            success: false,
            message: error.message
        })
    }

}
//routes for user register
const registerUser = async(req,res) => {
    try{
        const {name,email,password} = req.body;
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({
                success: false,
                message: "Email already exists"
            })
        }
        if(!validator.isEmail(email)){
            return res.json({
                success: false,
                message: "Invalid email"
            })
        }
        if(password.length < 8){
            return res.json({
                success: false,
                message: "Password should be at least 8 characters long"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({
            success: true,
            token
        })
    }
    catch(error){
        console.error(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}
export {loginUser,registerUser}