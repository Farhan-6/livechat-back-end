const { generateToken } = require("../lib/utils.js");
const { User } = require("../models/user.model.js");
const bcrypt = require("bcryptjs")


const signup = async (req,res)=>{
    const {fullName,email,password}= req.body;
    try {

        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fileds are required"})
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be 6 characters"})
        }

        const user = await User.findOne({email})

        if(user) return res.status(400).json({message:"User already exist"})

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            generateToken(newUser._id , res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName : newUser.fullName,
                email: newUser.email
            })
        }else {
            res.status(400).json({message: "Invalid user data"})
        }
    } catch (error) {
        console.log("error in  SignUp controller" , error.message)
        res.status(500).json({message:"Internal Server error"})
    }
}

const login = async (req,res)=>{
    const {email,password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Inavlid Credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password , user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Inavlid Credentials"})
        }

        generateToken(user._id , res)
        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            email : user.email,
        })
    } catch (error) {
        console.log("error in  login controller" , error.message)
        res.status(500).json({message:"Internal Server error"})
    }
}

const logout = (req,res)=>{
    try {
        res.cookie("jwt", "" , {maxAge:0})
        res.status(200).json({message:"Logout Successfull"})
    } catch (error) {
        console.log("error in  logout controller" , error.message)
        res.status(500).json({message:"Internal Server error"})
    }
}

const checkAuth = (req,res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {signup,login,logout, checkAuth}